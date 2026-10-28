import { useEffect, useRef, type ReactNode } from 'react';
import ShellIcon from './ShellIcon';
import './dialog.css';

export default function WorldDialog({ labelledBy, busy, onClose, children }: { labelledBy: string; busy: boolean; onClose: () => void; children: ReactNode }) {
  const reference = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = reference.current;
    dialog?.showModal();
    return () => { dialog?.close(); };
  }, []);
  return <dialog className="world-dialog" ref={reference} aria-labelledby={labelledBy} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <button className="world-dialog__close" aria-label="Закрыть окно" onClick={onClose} disabled={busy}><ShellIcon kind="close" /></button>
    {children}
  </dialog>;
}
