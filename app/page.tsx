import Game from "./components/game";

export default function Home() {
  console.log("pageview");
  return (
    <main className="min-h-screen">
      <Game />
    </main>
  );
}
