import React, {useState, useEffect} from "react";
import {getContenuPanier} from "../../services/ApiService";
import Error from "../Error";
import PanierLigne from "./PanierLigne";
import PanierTotal from "./PanierTotal";
import Spinner from "../Utils/Spinner";

function Panier(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [panier, setPanier] = useState([]);
    const [totalPanier, setTotalPanier] = useState(0);

    useEffect(() => {
        if (window.localStorage.getItem('panier') === null){
            window.localStorage.setItem('panier', "[]")
            setIsLoaded(true)
        } else if (window.localStorage.getItem('panier') === '[]'){
            setIsLoaded(true)
        } else { // TODO YC : Prevoir le cas ou le localstorage contient une chaine invalide et qui fait planter le parse
            getContenuPanier()
                .then(result => {
                        if (result === null) {
                            let msgError = {};
                            msgError['message'] = "Retour API sans réponse (result == null)"
                            setError(msgError)
                        } else {
                            setPanier(result.data[0].panier);
                            setTotalPanier(result.data[1].totalPanier);
                        }
                })
                .catch((e) => setError(e))
                .finally(() => setIsLoaded(true))
        }}, [])


    return (<>
            {
                (error) ?
                    (
                        <>
                            <div>Une erreur est survenue</div>
                            <Error error={error}/>
                        </>
                    )
                    : (<> {!isLoaded && (
                            <Spinner />
                        )}
                        <div className="row">
                            {panier.map((panierLigne, index) => (
                                <PanierLigne key={index}
                                             id={panierLigne.id}
                                             nom={panierLigne.nom}
                                             prix={panierLigne.prix}
                                             photo={panierLigne.photo}
                                />
                            ))}
                            {/*TODO YC : Créer un total de panier*/}
                            <PanierTotal total={totalPanier}/>
                        </div>
                    </>)
            }
        </>
    )

}

export default Panier;