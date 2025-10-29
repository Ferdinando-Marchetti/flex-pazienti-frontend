export default function EserciziPage() {
  return (
    <div>

    <h1>To Do: Flusso Esercizi Assegnati</h1>
        <p>Ciao! Dobbiamo implementare il flusso completo per l'esecuzione degli esercizi assegnati dal fisio, inclusa la raccolta del feedback post-sessione.</p>

        <h2>Il Flow è a 3 Step:</h2>

        <div>
            <h3>1. Pagina Elenco Schede (Entry Point)</h3>
            <div>
                <ul>
                    <li>Mostrare le schede di esercizi attive (es. "Rieducazione Spalla").</li>
                    <li>Link dalla Dashboard: <code>/app/esercizi</code>.</li>
                    <li><strong>Azione:</strong> Bottone <span>"INIZIA SESSIONE"</span>.</li>
                </ul>
            </div>
        </div>

        <div>
            <h3>2. Sessione Esercizi (Esecuzione)</h3>
            <div>
                <ul>
                    <li>URL dinamico: <code>/app/sessione/:schedaId</code>.</li>
                    <li>Visualizzare gli esercizi <span>uno alla volta</span> (con istruzioni/video).</li>
                    <li>Deve esserci un modo per completare gli esercizi in sequenza.</li>
                    <li><strong>Azione Finale:</strong> Bottone <span>"COMPLETA SESSIONE"</span> (che porta allo Step 3).</li>
                </ul>
            </div>
        </div>

        <div>
            <h3>3. Sondaggio di Valutazione (Feedback)</h3>
            <div>
                <ul>
                    <li>Pagina: <code>/app/feedback/:schedaId</code>.</li>
                    <li>Dopo l'allenamento, il paziente deve fare un sondaggio veloce.</li>
                    <li>Sono richieste <span>TRE VALUTAZIONI</span> obbligatorie (scala 1 a 5, con slider o stelle):
                        <ol>
                            <li><span>MOBILITÀ</span> (Quanto eri sciolto/fluido)</li>
                            <li><span>DOLORE</span> (Livello di dolore percepito)</li>
                            <li><span>FORZA</span> (Quanto era impegnativo/difficile)</li>
                        </ol>
                    </li>
                    <li>Aggiungi un campo note libero.</li>
                    <li><strong>Azione Finale:</strong> Bottone "Invia e Termina".</li>
                </ul>
            </div>
        </div>

        <p><strong>PS:</strong> Riutilizza i componenti UI (Button, Card, Input, Field) che abbiamo già in <code>@/components/ui/</code>. Grazie!</p>
    

    <h1>To Do: Flusso Esercizi Assegnati</h1>
        <p>Ciao! Dobbiamo implementare il flusso completo per l'esecuzione degli esercizi assegnati dal fisio, inclusa la raccolta del feedback post-sessione.</p>

        <h2>Il Flow è a 3 Step:</h2>

        <div>
            <h3>1. Pagina Elenco Schede (Entry Point)</h3>
            <div>
                <ul>
                    <li>Mostrare le schede di esercizi attive (es. "Rieducazione Spalla").</li>
                    <li>Link dalla Dashboard: <code>/app/esercizi</code>.</li>
                    <li><strong>Azione:</strong> Bottone <span>"INIZIA SESSIONE"</span>.</li>
                </ul>
            </div>
        </div>

        <div>
            <h3>2. Sessione Esercizi (Esecuzione)</h3>
            <div>
                <ul>
                    <li>URL dinamico: <code>/app/sessione/:schedaId</code>.</li>
                    <li>Visualizzare gli esercizi <span>uno alla volta</span> (con istruzioni/video).</li>
                    <li>Deve esserci un modo per completare gli esercizi in sequenza.</li>
                    <li><strong>Azione Finale:</strong> Bottone <span>"COMPLETA SESSIONE"</span> (che porta allo Step 3).</li>
                </ul>
            </div>
        </div>

        <div>
            <h3>3. Sondaggio di Valutazione (Feedback)</h3>
            <div>
                <ul>
                    <li>Pagina: <code>/app/feedback/:schedaId</code>.</li>
                    <li>Dopo l'allenamento, il paziente deve fare un sondaggio veloce.</li>
                    <li>Sono richieste <span>TRE VALUTAZIONI</span> obbligatorie (scala 1 a 5, con slider o stelle):
                        <ol>
                            <li><span>MOBILITÀ</span> (Quanto eri sciolto/fluido)</li>
                            <li><span>DOLORE</span> (Livello di dolore percepito)</li>
                            <li><span>FORZA</span> (Quanto era impegnativo/difficile)</li>
                        </ol>
                    </li>
                    <li>Aggiungi un campo note libero.</li>
                    <li><strong>Azione Finale:</strong> Bottone "Invia e Termina".</li>
                </ul>
            </div>
        </div>

        <p><strong>PS:</strong> Riutilizza i componenti UI (Button, Card, Input, Field) che abbiamo già in <code>@/components/ui/</code>. Grazie!</p>
    

    <h1>To Do: Flusso Esercizi Assegnati</h1>
        <p>Ciao! Dobbiamo implementare il flusso completo per l'esecuzione degli esercizi assegnati dal fisio, inclusa la raccolta del feedback post-sessione.</p>

        <h2>Il Flow è a 3 Step:</h2>

        <div>
            <h3>1. Pagina Elenco Schede (Entry Point)</h3>
            <div>
                <ul>
                    <li>Mostrare le schede di esercizi attive (es. "Rieducazione Spalla").</li>
                    <li>Link dalla Dashboard: <code>/app/esercizi</code>.</li>
                    <li><strong>Azione:</strong> Bottone <span>"INIZIA SESSIONE"</span>.</li>
                </ul>
            </div>
        </div>

        <div>
            <h3>2. Sessione Esercizi (Esecuzione)</h3>
            <div>
                <ul>
                    <li>URL dinamico: <code>/app/sessione/:schedaId</code>.</li>
                    <li>Visualizzare gli esercizi <span>uno alla volta</span> (con istruzioni/video).</li>
                    <li>Deve esserci un modo per completare gli esercizi in sequenza.</li>
                    <li><strong>Azione Finale:</strong> Bottone <span>"COMPLETA SESSIONE"</span> (che porta allo Step 3).</li>
                </ul>
            </div>
        </div>

        <div>
            <h3>3. Sondaggio di Valutazione (Feedback)</h3>
            <div>
                <ul>
                    <li>Pagina: <code>/app/feedback/:schedaId</code>.</li>
                    <li>Dopo l'allenamento, il paziente deve fare un sondaggio veloce.</li>
                    <li>Sono richieste <span>TRE VALUTAZIONI</span> obbligatorie (scala 1 a 5, con slider o stelle):
                        <ol>
                            <li><span>MOBILITÀ</span> (Quanto eri sciolto/fluido)</li>
                            <li><span>DOLORE</span> (Livello di dolore percepito)</li>
                            <li><span>FORZA</span> (Quanto era impegnativo/difficile)</li>
                        </ol>
                    </li>
                    <li>Aggiungi un campo note libero.</li>
                    <li><strong>Azione Finale:</strong> Bottone "Invia e Termina".</li>
                </ul>
            </div>
        </div>

        <p><strong>PS:</strong> Riutilizza i componenti UI (Button, Card, Input, Field) che abbiamo già in <code>@/components/ui/</code>. Grazie!</p>
    </div>
  )
}