import './App.css'

function App() {
  return (
    <>
      <section id="center">
        <div>
          <h1>www.starbug.com</h1>
        </div>
      </section>

      <section id="left">
        <div>
          <p>
            This web app built with React and Vite as the frontend, Flask as
            the backend API, and Nginx as a TLS enabled reverse proxy server.
            It is deployed as a collection of microservices running in Docker
            containers.
          </p>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="spacer"></section>
    </>
  )
}

export default App
