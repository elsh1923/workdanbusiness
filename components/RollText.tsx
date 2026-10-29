// Text that rolls up to reveal a second copy when its parent link or button is hovered.
export default function RollText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll-in" data-text={children}>
        {children}
      </span>
    </span>
  );
}
