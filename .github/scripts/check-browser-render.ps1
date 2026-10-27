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
    $profile = Join-Path $env:RUNNER_TEMP 'relics-edge-profile'
    $arguments = @('--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', "--user-data-dir=`"$profile`"", '--remote-debugging-port=9222', '--remote-debugging-address=127.0.0.1', '--window-size=1280,1100', 'about:blank')
    $browser = Start-Process -FilePath $edge -ArgumentList $arguments -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $outputDirectory 'browser.stdout.txt') -RedirectStandardError (Join-Path $outputDirectory 'browser.stderr.txt')
    $debugReady = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri 'http://127.0.0.1:9222/json/version' -TimeoutSec 2
            if ($response.StatusCode -eq 200) { $debugReady = $true; break }
        } catch { Start-Sleep -Seconds 1 }
    }
    if (-not $debugReady) { throw 'Edge debugging endpoint did not become ready.' }
    & node .github/scripts/check-sanctuary-ui.mjs $outputDirectory
    if ($LASTEXITCODE -ne 0) { throw 'Sanctuary browser interaction verification failed.' }
} finally {
    if ($browser -and -not $browser.HasExited) { Stop-Process -Id $browser.Id -ErrorAction SilentlyContinue }
    if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id -ErrorAction SilentlyContinue }
}
