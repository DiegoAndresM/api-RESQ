const express = require('express');
const mongoose = require('mongoose');
const Mixed = mongoose.Schema.Types.Mixed;
const cors = require('cors');


// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://admin:admin@cluster0.ndljknw.mongodb.net/ResQ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB Atlas');
}).catch((error) => {
  console.error('Error al conectar a MongoDB Atlas:', error);
});

const workersSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bloodtype: Mixed,
  age: Number,
  weight: Mixed,
  height: Mixed,
  status: Boolean
});


//const userSchema = new Schema({
  //email: String,
  //password: String
//});

const cordSchema = new mongoose.Schema({
  cname: String,
  location: {
    x: Number,
    y: Number
  }
});

const pulseSchema = new mongoose.Schema({
  pname: String,
  oxigen: Number,
  pulse: Number,
});




// Creación de los modelos de usuarios y robots
//const User = mongoose.model('user', userSchema);
const Workers = mongoose.model('workers', workersSchema);
const Cord = mongoose.model('cord', cordSchema);
const Pulse = mongoose.model('pulse', pulseSchema);



// Creación de la aplicación Express
const app = express();
app.use(express.json());

// Endpoint para obtener toda la información de los robots de un usuario
app.get('/api/workers/:email/workers', async (req, res) => {
  try{
  const { email } = req.params;
  const wrk = await Workers.findOne({email})

  if(!wrk){
    return res.status(404).json({error : 'usuario no encontrado'});
  }
  res.json(wrk);

  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({error: 'error en la consulta'})
  }

});


// Endpoint para obtener las coordenadas x y de un dispositivo por su codigo de dispositivo
app.get('/api/cord/:cname/coordinates', async (req, res) => {
  try {
    const { cname } = req.params; // creamos la variable "cname" donde mandaremos todo lo que este en la BD

    // Buscar el robot por su código
    const cord = await Cord.findOne({ cname });// Nos devolvera las cordenadas dependiendo del nombre exigido

    //If por si no encuentra el dispositivo
    if (!cord) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    const { x, y } = cord.location; //Aqui regresa los valores de "x" y de "y"

    res.json({ x, y }); // Trae de la base de datos solamente las cordenadas dependiendo del nombre dado
  } catch (error) {
    console.error('Error al obtener las coordenadas del dispositivo:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
  }
});


app.get('/api/pulse/:pname/pulse', async (req, res) => {
  try {
    const { pname } = req.params; // creamos la variable "cname" donde mandaremos todo lo que este en la BD

    // Buscar el robot por su código
    const pulse = await Pulse.findOne({ pname });// Nos devolvera las cordenadas dependiendo del nombre exigido

    //If por si no encuentra el dispositivo
    if (!pulse) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    res.json(pulse); // Trae de la base de datos solamente las cordenadas dependiendo del nombre dado

  } catch (error) {
    console.error('Error al obtener las coordenadas del dispositivo:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
  }
});

// Puerto en el que se ejecutará el servidor
// const port = 3000;

// // Iniciar el servidor
// app.listen(port, () => {
//   console.log(`Servidor Express iniciado en el puerto ${port}`);
// });

module.exports = app;