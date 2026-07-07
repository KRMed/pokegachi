export default function Button({ text, onClick }: { text: string; onClick: () => void }) {
  return <button className="nes-btn" onClick={onClick}>{text}</button>;
}

//to use the component you just do <Button text="whatever" onClick={() => {}} />