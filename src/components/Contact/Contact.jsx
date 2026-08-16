const Contact = () => {
  const whatsappNumber = "242064490583";

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-6">
            <span className="section-label contact-label">
              <span></span>
              Contact
            </span>

            <h2>
              Parlons de votre
              <span> projet.</span>
            </h2>

            <p className="contact-description">
              Une question sur une formation, une inscription ou un projet
              professionnel ? Notre équipe est directement accessible.
            </p>

            <div className="contact-list">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="contact-item"
              >
                <div className="contact-icon">
                  <i className="bi bi-whatsapp"></i>
                </div>

                <div>
                  <small>WHATSAPP</small>
                  <strong>+242 06 449 05 83</strong>
                </div>

                <i className="bi bi-arrow-up-right contact-arrow"></i>
              </a>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="bi bi-envelope"></i>
                </div>

                <div>
                  <small>E-MAIL</small>
                  <strong>congocnl@gmail.com</strong>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>

                <div>
                  <small>LOCALISATION</small>
                  <strong>Brazzaville, République du Congo</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="contact-panel">
              <span>// CONTACT DIRECT</span>

              <h3>Une demande particulière ?</h3>

              <p>
                Écrivez directement à notre équipe via WhatsApp pour obtenir une
                réponse rapide.
              </p>

              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="contact-button"
              >
                <i className="bi bi-whatsapp"></i>
                Contacter le CNL
                <i className="bi bi-arrow-up-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;