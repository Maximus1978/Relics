type Kind = 'sanctuary' | 'chronicle' | 'archive' | 'plus' | 'check' | 'close';

const paths: Record<Kind, string> = {
  sanctuary: 'M3 21V10l3-5 3 5v11M15 21V10l3-5 3 5v11M9 21V8l3-5 3 5v13M1 21h22M11 21v-6h2v6',
  chronicle: 'M5 3h14v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v18M9 7h6m-6 4h6m-6 4h4',
  archive: 'M3 4h18v5H3ZM5 9v12h14V9M9 13h6',
  plus: 'M5 12h14M12 5v14',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12M18 6 6 18',
};

export default function ShellIcon({ kind }: { kind: Kind }) {
  return <svg className="line-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={paths[kind]} /></svg>;
}
