export default `<!DOCTYPE html>
<html>
  <head>
    <style>
      * {
        font-family: Inter, ui-sans-serif, system-ui;
        font-size: 15px;
      }
      #bg {
        background-color: #f0e8dd;
        padding: 30px;
      }
      section {
        padding: 25px;
        background-color: white;
        border-radius: 5px;
        max-width: 500px;
        margin: 0 auto;
      }
      img {
        display: block;
        height: 100px;
        margin: 0 auto;
        margin-bottom: 25px;
      }
      p {
        color: #656565;
      }
      a {
        color: #5115f7;
      }
      #cta {
        color: white;
        background-color: #5115f7;
        padding: 20px 30px;
        text-decoration: none;
        display: block;
        text-align: center;
        font-weight: bold;
        margin: 0 auto;
        margin-top: 40px;
        width: 70px;
        transition: background 0.3s;
      }
      #cta:hover {
        background-color: #2b0594;
      }
    </style>
  </head>
  <body>
    <div id="bg">
      <img src="https://demo.deptdxp.com/DEPT-DASH-LOGO.png" alt="gems-logo" />
      <section>
        <p><strong>{{title}}</strong></p>
        <p>{{text}}</p>
        <p>
          <a id="cta" href="{{cta.url}}">{{cta.text}}</a>
        </p>
      </section>
    </div>
  </body>
</html>
`;
