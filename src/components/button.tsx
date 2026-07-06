export default function Button({ text }: { text: string }) {
  return <button className="nes-btn">{text}</button>;
}

//to use the componenet you just do <Button text="whatever" />