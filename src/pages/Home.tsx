import './home.css';
import logo from '/pokegachi_logo.png'

export default function Home() {
  const pokemons: string[] = [
    '/first_roll.png',
    '/pokegachi_logo.png',
    '/login_page.png'
  ];
  const trainer = '/home.png';

  return (
    <div className="home-page">
      <div className="logo-container">
        <img className="logo" src={logo} />
      </div>
      <div className="group-container">
        <div className="group">
          <img className="trainer" src={trainer} />
          <div className="pokemons">
            {pokemons.map((pokemon, idx) => (
              <img key={idx} src={pokemon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}