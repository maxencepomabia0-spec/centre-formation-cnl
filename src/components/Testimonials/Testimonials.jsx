function Testimonials() {
  const testimonials = [
    {
      quote:
        "La formation Robot Structural Analysis m'a permis de finaliser mon projet de fin d'études sans blocage.",
      name: "Fabrice M.",
      role: "Étudiant en Génie Civil, Brazzaville",
      rating: 5,
    },
    {
      quote:
        "Grâce au module BIM, mon bureau d'études a réduit ses délais de rendu de plans de moitié.",
      name: "Sandrine K.",
      role: "Architecte, Pointe-Noire",
      rating: 5,
    },
    {
      quote:
        "Un encadrement sérieux et des formateurs disponibles, même après la fin de la session.",
      name: "Entreprise BTP locale",
      role: "Partenaire formation continue",
      rating: 4,
    },
  ];

  return (
    <section className="testimonials-section" id="temoignages">

      <div className="container">

        <div className="testimonials-heading">

          <div>
            <span className="section-label">
              <span></span>
              Témoignages
            </span>

            <h2>
              Ils parlent de leur
              <span> expérience.</span>
            </h2>
          </div>

          <p>
            Témoignages présentés à titre d'exemple —
            les avis réels des apprenants pourront être
            ajoutés ensuite.
          </p>

        </div>


        <div className="row g-3">

          {testimonials.map((testimonial, index) => (

            <div
              className="col-lg-4"
              key={index}
            >

              <article className="testimonial-card">

                <div className="testimonial-top">

                  <i className="bi bi-quote"></i>

                  <div className="testimonial-stars">
                    {"★".repeat(testimonial.rating)}
                    {"☆".repeat(5 - testimonial.rating)}
                  </div>

                </div>


                <p className="testimonial-quote">
                  « {testimonial.quote} »
                </p>


                <div className="testimonial-author">

                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>
                    <strong>
                      {testimonial.name}
                    </strong>

                    <span>
                      {testimonial.role}
                    </span>
                  </div>

                </div>

              </article>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Testimonials;