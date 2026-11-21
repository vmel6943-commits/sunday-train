import { BookOpen, Check, ClipboardList, Clock3, Film, Mail, Newspaper, ScrollText, Users, type LucideIcon } from 'lucide-react';
import type { GameState, SceneId } from '../game/model';

const boardingTargets: Partial<Record<SceneId, string>> = {
  desk: 'envelope',
  station: 'door',
  machine: 'activate',
  platform: 'board',
  journal: 'stamp',
};

export function primaryObject(game: GameState): string | undefined {
  switch (game.scene) {
    case 'hall':
      if (!game.flags.includes('briefed')) return 'bell';
      return game.ticket ? 'gate' : 'machine';
    case 'gate':
      return game.ticket?.checked ? undefined : 'check';
    case 'carriage':
      return game.flags.includes('map-seen') ? 'spy' : 'route';
    case 'informant':
      return game.firstVote ? 'case' : 'report';
    default:
      return boardingTargets[game.scene];
  }
}

const evidenceItems: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'video', label: '视频档案', icon: Film },
  { id: 'notice', label: '开放公告', icon: ScrollText },
  { id: 'timeline', label: '事件时间线', icon: Clock3 },
  { id: 'witness', label: '现场证词', icon: Users },
  { id: 'spread', label: '传播记录', icon: Newspaper },
  { id: 'evidence', label: '调查笔记', icon: BookOpen },
];

export const objectIcons: Record<string, LucideIcon> = {
  ...Object.fromEntries(evidenceItems.map(({id, icon}) => [id, icon])),
  envelope: Mail,
};

export function MaterialTray({ game, onOpen, onContinue }: {
  game: GameState;
  onOpen: (id: string) => void;
  onContinue: () => void;
}) {
  const read = game.evidence.length;
  const action = game.finalVote ? '继续夜行' : read ? '记录新的判断' : '从视频看起';
  return (
    <section className="material-tray" aria-label="皮箱里的调查材料">
      <div className="material-tray-heading">
        <ClipboardList size={20} aria-hidden="true"/>
        <div>
          <strong>翻阅材料</strong>
          <small>{game.finalVote ? '判断已记录' : read ? `已记录 ${read} 份 · 可继续翻阅` : '任选一份，从好奇的地方开始'}</small>
        </div>
      </div>
      <div className="material-tabs">
        {evidenceItems.map(({id, label, icon: Icon}) => {
          const seen = id === 'evidence' ? game.flags.includes('board') : game.evidence.includes(id);
          return (
            <button type="button" key={id} onClick={() => onOpen(id)} className={seen ? 'material-read' : ''}>
              <Icon size={19} aria-hidden="true"/>
              <span>{label}</span>
              {seen && <Check size={12} className="material-check" aria-label="已记录"/>}
            </button>
          );
        })}
      </div>
      <button type="button" className="material-next" onClick={read || game.finalVote ? onContinue : () => onOpen('video')}>
        {action}
      </button>
    </section>
  );
}
