var express = require('express');
var app = express();
app.use(express.json());
function main(){
  
  const db = require('./models')
  
  db.sequelize.sync({ alter:false }).then(()=>{
    console.log("Altered DB!!");
  })
  require("./routes/routes")(app);

}
main();

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

module.exports = app;