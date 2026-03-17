interface AvatarSelectorProps {
  currentAvatar: string;
  userId: number;
  onUpdate: (spriteName: string) => void;
}

const AVATAR_OPTIONS = ['Tux.png', 'fedora.png', 'arch.png', 'gnome.png', 'bash.png', 'evil1.png'];

export default function AvatarSelector({ currentAvatar, userId, onUpdate }: AvatarSelectorProps) {
  const handleSelect = async (spriteName: string) => {
    const res = await fetch('/api/users/update-avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, avatarUrl: spriteName }),
    });

    if (res.ok) {
      onUpdate(spriteName);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 p-3 bg-[#16161e] border border-[#bb9af7] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {AVATAR_OPTIONS.map((sprite) => (
        <button
          key={sprite}
          onClick={() => handleSelect(sprite)}
          className={`hover:scale-110 active:scale-95 transition-all p-1 rounded-md ${
            currentAvatar === sprite ? 'bg-[#1f2335] ring-1 ring-[#7aa2f7]' : 'hover:bg-[#24283b]'
          }`}
        >
          <img src={`/sprites/${sprite}`} className="w-10 h-10 object-contain" alt={sprite} />
        </button>
      ))}
    </div>
  );
}