import React from "react";
import ProduitsListe from "./ProduitsListe";

function BurgerMain() {
    const NOM_CATEGORIE = 'Burger'

    return (<>
            {/* <!-- Carousel  --> */}
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel slide">
                        <img src="/HomePage/slidepageburger.jpg" className="d-block w-100" alt="..."/>
                    </div>
                </div>
            </div>
            {/* <!-- Fin carousel --> */}

            <div className="container">

                <ProduitsListe nomCategorie={NOM_CATEGORIE}/>

            </div>


        </>
    )

}

export default BurgerMain;