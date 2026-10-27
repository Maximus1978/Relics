$ErrorActionPreference = 'Stop'
$outputDirectory = Join-Path $env:RUNNER_TEMP 'relics-browser-preview'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$server = $null
$browser = $null
try {
    $vite = Join-Path (Get-Location) 'node_modules/vite/bin/vite.js'
    $server = Start-Process -FilePath (Get-Command node.exe).Source -ArgumentList @("`"$vite`"", 'preview', '--host', '127.0.0.1', '--port', '1420', '--strictPort') -WorkingDirectory (Get-Location).Path -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $outputDirectory 'server.stdout.txt') -RedirectStandardError (Join-Path $outputDirectory 'server.stderr.txt')
    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        if ($server.HasExited) { throw 'Preview server exited before readiness.' }
        try {
            $response = Invoke-WebRequest -Uri 'http://127.0.0.1:1420' -TimeoutSec 2
            if ($response.StatusCode -eq 200) { $ready = $true; break }
        } catch { Start-Sleep -Seconds 1 }
    }
    if (-not $ready) { throw 'Preview server did not become ready.' }
    $edgeCandidates = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe")
    $edge = $edgeCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    if (-not $edge) { throw 'Hosted Windows runner has no Microsoft Edge executable.' }
    $screenshot = Join-Path $outputDirectory 'browser-preview.png'
    $dom = Join-Path $outputDirectory 'rendered-dom.html'
    $profile = Join-Path $env:RUNNER_TEMP 'relics-edge-profile'
    $arguments = @('--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', "--user-data-dir=`"$profile`"", '--window-size=1280,1100', '--virtual-time-budget=8000', "--screenshot=`"$screenshot`"", '--dump-dom', 'http://127.0.0.1:1420')
    $browser = Start-Process -FilePath $edge -ArgumentList $arguments -WindowStyle Hidden -PassThru -RedirectStandardOutput $dom -RedirectStandardError (Join-Path $outputDirectory 'browser.stderr.txt')
    if (-not $browser.WaitForExit(60000)) { throw 'Headless browser timed out.' }
    if ($browser.ExitCode -ne 0) { throw 'Headless browser failed.' }
    $html = Get-Content -LiteralPath $dom -Raw -Encoding utf8
    foreach ($required in @('<h1>Sanctuary</h1>', 'id="habits-title"', 'id="journal-title"', 'type="date"')) {
        if (-not $html.Contains($required)) { throw "Rendered UI is missing expected content: $required" }
    }
    if (-not (Test-Path -LiteralPath $screenshot)) { throw 'Browser screenshot missing.' }
    if ((Get-Item -LiteralPath $screenshot).Length -eq 0) { throw 'Browser screenshot empty.' }
    @{ browserRendering = 'passed'; nativeUiRuntimeVerified = $false; url = 'http://127.0.0.1:1420' } | ConvertTo-Json |
        Set-Content (Join-Path $outputDirectory 'result.json') -Encoding utf8
    Write-Output 'Browser-only rendering verified. Native Tauri UI remains unverified.'
} finally {
    if ($browser -and -not $browser.HasExited) { Stop-Process -Id $browser.Id -ErrorAction SilentlyContinue }
    if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id -ErrorAction SilentlyContinue }
}
