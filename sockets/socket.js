const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
// console.log('init server');
bands.addBand( new Band('Queen'));
bands.addBand( new Band('Metallica'));
bands.addBand( new Band('Rammstein'));
bands.addBand( new Band('Kiss'));
bands.addBand( new Band('My chemycal romance'));


//Mensajes de sockets 
io.on('connection', client => {
    console.log('Cliente Conectado');

   client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente Desconectado');
     });

     client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
     }); //debe ser igual al mensaje que esta el el html

     client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
      });

      client.on('add-band', (payload) =>{
         const newBand = new Band(payload.name);
         bands.addBand(newBand);  
         io.emit('active-bands', bands.getBands());
       });

       //Delete-band
      client.on('delete-band', (payload) =>{
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
      });
   //    client.on('emitir-mensaje', (payload) => {
   //       // console.log(payload)
   // //      io.emit('emitir-mensaje','HEY!!!'); //Para emitir a todos los usuarios
   //      client.broadcast.emit('nuevo-mensaje   ', payload); //para emitir a todos menos al usuario que lo emitio
   //    });

  });