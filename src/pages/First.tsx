import Button from '../components/button';
import './first.css';

export default function First() {
    return (
    <div className="page">
      <div className="stuff">
        <h1 className="text-box">It's time to roll for your first Pokemon!</h1>
        <Button text="Roll" />
      </div>
    </div>
  );
 
}