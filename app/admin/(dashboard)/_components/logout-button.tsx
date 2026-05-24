"use client";

export function LogoutButton() {
  return (
    <button
      type="submit"
      className="w-full rounded-full px-4 py-2 text-xs font-medium border text-white/80 hover:border-[#00d4ff] hover:text-[#00d4ff]"
      style={{ borderColor: "rgba(255,255,255,0.18)" }}
    >
      Déconnexion
    </button>
  );
}
