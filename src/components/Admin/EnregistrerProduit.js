import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {getAdminVerifie, getCatProduitData} from "../../services/ApiService";
import Error from "../Error";
import Axios from "axios";
import {API_ENREGISTRER_PRODUIT} from "../../constants";
import {useForm} from "react-hook-form";
import Spinner from "../Utils/Spinner";

function EnregistrerProduit() {
    const {handleSubmit, register, errors} = useForm();
    const fileref = useRef();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [accesAutorise, setAccesAutorise] = useState(false);
    const [categoriesProduit, setCategoriesProduit] = useState([]);
    const history = useHistory();

    useEffect(() => {
        setIsLoading(true)
        getAdminVerifie()
            .then((result) => {
                if (result.data['reponse'] !== 'Adminnistrateur vérifié') {
                    alert("Accès non autorisé à cette page")
                    history.push('/')
                } else {
                    getCatProduitData()
                        .then((result) => {
                            let categories = []
                            for (let categorie of result.data["hydra:member"]) {
                                categories.push(categorie.nom)
                            }
                            setCategoriesProduit(categories)
                            setAccesAutorise(true)
                            setIsLoading(false)
                        })
                        .catch((e) => setError(e))
                }
            })
            .catch((e) => setError(e))
    }, [history])

    const onSubmit = values => {
        const formdata = new FormData()
        Object.keys(values).forEach(function (key) {
            formdata.append(key, values[key])
        }) // on recup toutes les clef de value, on boucle dessus et le append les insere ainsi que les valeurs
        formdata.append('file', fileref.current.files[0]) // on insere dans le formdata le fichier
        setIsLoading(true)
        // fetch('google.com', {'method' : 'post', 'body' : formdata})
        return Axios.post(API_ENREGISTRER_PRODUIT, formdata, {
            headers: {
                Authorization: "Bearer " + window.localStorage.token,
                'content-type': 'multipart/form-data'
            }
        })
            .then(async (result) => {
                if (result.data['reponse'] === 'Produit enregistré') {
                    alert("Produit enregistré")
                    history.push('/adminMain')
                }
            })
            .catch(async (e) => {
                alert('erreur API BackEnd lors de l\'enregistrement du produit, voir console')
                console.log(e)
            })
    }

    if (error) {
        return (
            <>
                <div>Une erreur est survenue</div>
                <Error error={error}/>
            </>
        )
    } else if (isLoading) {
        return (<>
            <Spinner/>
        </>)
    } else if (isLoading === false && accesAutorise === true) {
        return (
            <>

                {/* <!-- Carousel  --> */}
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="/HomePage/slidepageadmin.jpg" className="d-block w-100"
                                 alt="..."/>
                        </div>
                    </div>
                </div>
                {/* <!-- Fin carousel --> */}

                <div className="text-center mt-5">
                    <h1>Administration du site : Enregistrer un nouveau produit</h1>
                </div>

                <div className="container">
                    <div className="row mt-5">
                        <div className="col">
                            <form enctype='multipart/form-data' onSubmit={handleSubmit(onSubmit)}>

                                <div className="form-group mt-5">
                                    <label htmlFor="nom">Nom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue=""
                                        name="nom"
                                        ref={register({
                                            required: "Champs obligatoire",
                                            pattern: {
                                                value: /^[0-9a-z ,.'-]+$/i,
                                                message: "Nom invalide"
                                            }
                                        })}/>
                                    <small
                                        className="form-text text-danger">{errors.nom && errors.nom.message}</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue=""
                                        name="description"
                                        ref={register({
                                            required: "Champs obligatoire"
                                        })}/>
                                    <small
                                        className="form-text text-danger">{errors.description && errors.description.message}</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="prix">Prix</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue=""
                                        name="prix"
                                        ref={register({
                                            required: "Champs obligatoire",
                                            pattern: {
                                                value: /^[0-9]+(\.|)[0-9]{0,2}$/g,
                                                message: "Prix invalide (2 décimales maximum, pas de devise)"
                                            }
                                        })}/>
                                    <small
                                        className="form-text text-danger">{errors.prix && errors.prix.message}</small>
                                </div>

                                <div className="form-group">
                                    Promotion :
                                    <pre>
                                    <input name="promo" type="radio" value="true" ref={register({
                                        required: "Champs obligatoire"
                                    })
                                    }/>
                                    <label htmlFor="true"> Oui      </label>
                                    <input name="promo" type="radio" value="false" ref={register({
                                        required: "Champs obligatoire"
                                    })
                                    }/>
                                    <label htmlFor="false"> Non</label>
                                    <small
                                        className="form-text text-danger">{errors.promo && errors.promo.message}</small>
                                </pre>
                                </div>

                                {/* <div className="form-group mt5">
                                Catégorie de produit :
                                <select name="categorie" ref={register}>
                                    {categoriesProduit.map(
                                        (cat)=> (
                                            <option value={cat}>{cat}</option>
                                        )
                                    )}
                                </select>
                            </div> */}

                                <div className="form-group mt5">
                                    <label for="inputState">Catégorie de produit :</label>
                                    <select className="form-control" name="categorie" ref={register}>
                                        {categoriesProduit.map(
                                            (cat) => (
                                                <option value={cat}>{cat}</option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div>
                                    Image du produit :
                                    <input type="file" name="photo" ref={fileref}/>
                                </div>


                                <button type="submit" className="mr-5 my-5 btn btn-warning text-light mt-4">Envoyer</button>
                                <button type="button" className="ml-5 my-5 btn btn-warning text-light"onClick={() => (history.push("/adminMain"))}>Retour</button>
                            </form>
                        </div>

                        <div className="col-lg d-none d-sm-block mt-3">
                            <div className="row">
                                <div className="col d-flex justify-content-center">
                                    <img src="/HomePage/enregistrerProduit.jpg" className="d-block w-100" alt="..."/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </>
        )
    } else {
        return (<></>)
    }
}

export default EnregistrerProduit;