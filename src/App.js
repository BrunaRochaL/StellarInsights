import React, { useEffect, useState } from "react";
import "./index.css";

// Estados para armazenar dados recebidos das APIs (imagem, foguetes, portos de lançamentos)
const NasaSpaceXInfo = () => {
  const [nasaImage, setNasaImage] = useState(null);
  const [rocketDetails, setRocketDetails] = useState(null);
  const [launchPads, setLaunchPads] = useState([]);
  const [isLaunchPadsVisible, setIsLaunchPadsVisible] = useState(false);

  // Chave de API para autenticação na API da NASA.
  const nasaApiKey = "J3plIpojLdU9eCVBEd4oGhUGuoCcESopWRKjVEj4";

  // Função assíncrona para buscar a imagem do dia da NASA.
  const fetchNasaImageOfTheDay = async () => {
    try {
      // Faz a chamada para a API da NASA e espera pela resposta.
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`
      );
      // Checa se a resposta é bem-sucedida.
      if (!response.ok) {
        throw new Error(
          `Erro ao buscar a Imagem do Dia da NASA: ${response.statusText}`
        );
      }
      // Atualiza o estado com os dados recebidos.
      const data = await response.json();
      setNasaImage(data);
    } catch (error) {
      // Captura e loga qualquer erro que ocorra durante a chamada da API ou no processamento dos dados.
      console.error("Erro ao buscar a Imagem do Dia da NASA:", error.message);
    }
  };

  // Função assíncrona para buscar dados da SpaceX
  const fetchSpaceXData = async (endpoint) => {
    try {
      // Faz a chamada para a API da SpaceX e espera pela resposta.
      const url = `https://api.spacexdata.com/v4/${endpoint}`;
      const response = await fetch(url);
      // Checa se a resposta é bem-sucedida.
      if (!response.ok) {
        throw new Error(
          `Erro ao buscar informações da SpaceX: ${endpoint}: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      // Captura e loga qualquer erro que ocorra durante a chamada da API ou no processamento dos dados.
      console.error(
        `Erro ao buscar informações da SpaceX: ${endpoint}`,
        error.message
      );
    }
  };

  // useEffect para executar as funções de busca de dados na montagem do componente.
  useEffect(() => {
    // Busca a imagem do dia da NASA.
    fetchNasaImageOfTheDay();
    // ID específico de um foguete para buscar na API da SpaceX.
    const rocketId = "5e9d0d95eda69955f709d1eb";
    // Busca dados de um foguete específico e de portos de lançamento ativos.
    fetchSpaceXData(`rockets/${rocketId}`).then(setRocketDetails);
    // Filtra por portos de lançamento ativos e limita os resultados.
    fetchSpaceXData("launchpads").then((data) => {
      const activePads = data
        .filter((pad) => pad.status === "active")
        .slice(0, 3);
      setLaunchPads(activePads);
    });
  }, []);

  const displayLaunchPads = () => {
    return launchPads.map((pad, index) => (
      <div
        key={index}
        className={isLaunchPadsVisible ? "launch-pad" : "launch-pad hidden"}
      >
        <h3>{pad.name}</h3>
        <p>
          Local: {pad.locality}, {pad.region}
        </p>
        <p>Status: {pad.status}</p>
        <p>Detalhes: {pad.details}</p>
      </div>
    ));
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="background-container" id="home-section">
      <div>
        <nav>
          <ul className="menu">
            <li
              className="menu-item"
              onClick={() => scrollToSection("home-section")}
            >
              HOME
            </li>
            <li
              className="menu-item"
              onClick={() => scrollToSection("spacex-section")}
            >
              SPACEX
            </li>
            <li
              className="menu-item"
              onClick={() => scrollToSection("nasa-section")}
            >
              NASA
            </li>
          </ul>
        </nav>
      </div>
      <div className="centered-content">
        <h1>Stellar Insights</h1>
      </div>

      <div className="section" id="spacex-section">
        {rocketDetails && (
          <div className="section-text">
            <h2 className="section-title">SPACEX: Curiosities and News</h2>
            <span>
              <h3>Details about one of the Rockets: {rocketDetails.name}</h3>
            </span>{" "}
            <div>
              {rocketDetails.description.split("\n").map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p> /* Cada parágrafo receberá o efeito */
              ))}
            </div>
            <h3>SpaceX launch ports:</h3>
            {isLaunchPadsVisible && (
              <div className="text-section">{displayLaunchPads()}</div>
            )}
            <button
              onClick={() => setIsLaunchPadsVisible(!isLaunchPadsVisible)}
            >
              {isLaunchPadsVisible ? "Ver Menos" : "Ver Mais"}
            </button>
          </div>
        )}

        <div className="logos">
          <div className="logo-company">
            <img src="/spacex.png" alt="SpaceX Logo"></img>
          </div>
          <div className="astronaut">
            <img src="/astronaut.png" alt="astronaut"></img>
          </div>
        </div>
      </div>

      <div className="section" id="nasa-section">
        {nasaImage && (
          <div className="section-text">
            <h2 className="section-title">
              NASA: Astronomy Picture of the Day
            </h2>
            <span className="typed-text">{nasaImage.title}</span>{" "}
            <p>Date: {nasaImage.date}</p>
            <p>About the picture: </p>
            <div className="typed-text-container">
              {nasaImage.explanation.split("\n").map((paragraph, index) => (
                <p key={index} className="typed-text">
                  {paragraph}
                </p>
              ))}{" "}
            </div>
            <p>
              URL: <a href={nasaImage.url}>{nasaImage.url}</a>
            </p>
            <div className="logo-company" style={{ marginLeft: "900px" }}>
              <img src={nasaImage.url} alt=""></img>{" "}
            </div>
          </div>
        )}
        <div className="logos">
          <div
            className="logo-company nasa-img "
            style={{ marginTop: "-400px" }}
          >
            <img
              src="/nasalogo.png"
              alt="NASA Logo"
              className="nasa-img "
            ></img>
          </div>
        </div>
      </div>
      <footer
        style={{ display: "flex", justifyContent: "flex-end", margin: "0px" }}
      >
        <img src="/detail.png" alt="Detail"></img>
      </footer>
    </div>
  );
};

export default NasaSpaceXInfo;
