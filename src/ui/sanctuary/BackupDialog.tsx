import { useState } from 'react';
import { nativeBackup, type BackupPreview, type BackupSummary } from '../../platform/backup';
import type { RelicsModel } from '../../application/useRelicsModel';
import WorldDialog from './WorldDialog';
import './backup.css';

function Summary({ value }: { value: BackupSummary }) {
  return <dl className="backup-summary"><dt>Создана</dt><dd>{new Date(value.exportedAt).toLocaleString('ru-RU')}</dd>
    <dt>Привычек</dt><dd>{value.habits} (в архиве: {value.archivedHabits})</dd><dt>Записей активности</dt><dd>{value.activities}</dd>
    <dt>Формат</dt><dd>relics-backup v{value.formatVersion}, схема {value.databaseSchemaVersion} — поддерживается</dd></dl>;
}

export default function BackupDialog({ model }: { model: RelicsModel }) {
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [safetyFile, setSafetyFile] = useState('');

  async function execute(action: () => Promise<void>) {
    setError(''); setMessage('');
    try { await action(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : typeof failure === 'string' ? failure : 'Не удалось выполнить операцию с копией.'); }
  }

  async function cancelPreview() {
    await model.backupOperation(nativeBackup.cancel);
    setPreview(null); setMessage('Восстановление отменено. Данные не изменены.');
  }

  async function close() {
    if (model.busy) return;
    if (model.native) {
      try { await model.backupOperation(nativeBackup.cancel); }
      catch { setError('Не удалось отменить предпросмотр. Повторите закрытие.'); return; }
    }
    model.closeBackup();
  }

  return <WorldDialog labelledBy="backup-title" busy={model.busy} onClose={() => void close()}>
    <div className="backup-dialog"><h2 id="backup-title">Резервная копия</h2>
      <p>Копия хранит привычки, архив и журнал с исходными датами и снимками. Работает без интернета.</p>
      <p className="backup-privacy">JSON не зашифрован. Храните копии в личной папке и не публикуйте их.</p>
      {!model.native ? <p className="backup-unavailable" role="status">Доступно только в приложении Relics для Windows. Браузерная демонстрация не создаёт и не восстанавливает файлы.</p>
        : <>
          {!preview && <div className="form-actions"><button className="button-primary" disabled={model.busy || !model.canSave} onClick={() => void execute(async () => {
            const saved = await model.backupOperation(nativeBackup.export);
            if (saved) { setMessage(`Копия записана: привычек — ${saved.habits}, действий — ${saved.activities}.`); setSafetyFile(''); }
          })}>Создать копию</button>
          <button disabled={model.busy || !model.canSave} onClick={() => void execute(async () => { setPreview(await model.backupOperation(nativeBackup.preview)); setSafetyFile(''); })}>Выбрать копию</button></div>}
          {preview && <section aria-labelledby="backup-preview-title"><h3 id="backup-preview-title">Копия проверена</h3><Summary value={preview.summary} />
            <p className="backup-replacement">Все текущие привычки и записи журнала будут заменены данными этой копии. Объединения не будет. Перед заменой Relics сохранит защитную копию текущих данных; если это не удастся, восстановление отменится.</p>
            <div className="form-actions"><button autoFocus disabled={model.busy} onClick={() => void execute(cancelPreview)}>Отмена</button>
              <button className="button-primary" disabled={model.busy} onClick={() => void execute(async () => {
                const token = preview.token;
                setPreview(null);
                const restored = await model.backupOperation(() => nativeBackup.restore(token), true);
                setSafetyFile(restored.safetyFile);
                setMessage(`Восстановление завершено: привычек — ${restored.summary.habits}, действий — ${restored.summary.activities}.`);
              })}>Заменить данные и восстановить</button></div>
          </section>}
          <p className="backup-recovery">Защитные копии сохраняются в папке recovery рядом с локальной базой. Их можно выбрать для восстановления так же, как обычную копию. Папка Windows: %APPDATA%\\local.relics.app\\recovery.</p>
        </>}
      <p role="status" aria-live="polite">{model.busy ? 'Выполняется операция с копией…' : message}</p>
      {safetyFile && <p className="backup-file">Защитная копия: {safetyFile}</p>}
      {error && <p role="alert">{error}</p>}
      <div className="form-actions"><button disabled={model.busy} onClick={() => void close()}>Закрыть</button></div>
    </div>
  </WorldDialog>;
}
