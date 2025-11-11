import { Link } from "react-router-dom";

export default function PaginaBenvenuto() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="p-10 bg-card rounded-2xl shadow-2xl max-w-md w-full text-center border-t-4 border-primary transform transition-all hover:scale-[1.02]">
        {/* Icona */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full shadow-inner">
            <svg
              className="w-14 h-14 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.526a2 2 0 01-1.789-2.894l3.5-7zM7 9H4v6h3"
              ></path>
            </svg>
          </div>
        </div>

        {/* Titolo */}
        <h1 className="text-4xl font-extrabold text-foreground mb-3">
          Bentornato!
        </h1>

        {/* Sottotitolo */}
        <p className="text-lg text-muted-foreground font-medium">
          Sei pronto ad allenarti?
        </p>

        {/* Bottone */}
        <Link to='/app/allenamento'>
            <button className="mt-8 px-8 py-3 bg-primary text-primary-foreground text-lg font-semibold rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-300">
            Inizia l'Allenamento
            </button>
        </Link>
      </div>
    </div>
  );
}
