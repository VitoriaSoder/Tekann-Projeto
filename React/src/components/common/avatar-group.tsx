export interface AvatarGroupProps {
  users: { initials: string; id: string; color?: string }[]
  maxCount?: number
}
export function AvatarGroup({ users, maxCount = 3 }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, maxCount)
  const overflow = users.length > maxCount ? users.length - maxCount : 0
  return (
    <div className="flex items-center">
      {visibleUsers.map((user, i) => (
        <div
          key={user.id}
          className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white relative font-semibold text-sm"
          style={{
            zIndex: visibleUsers.length - i + (overflow > 0 ? 1 : 0),
            marginLeft: i !== 0 ? "-12px" : "0",
            backgroundColor: user.color || "black",
            color: user.color ? "black" : "white",
          }}
        >
          {user.initials}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white relative font-semibold text-sm bg-[#ccf32f] text-black"
          style={{
            zIndex: 1,
            marginLeft: "-12px",
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
