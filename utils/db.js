const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/nur", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// //menambah 1 data
// const contact1 = new Contact({
//   nama: " ansyah",
//   noHp: "08517715375",
//   email: "ansyah@gmail.com",
// });

// //simpan contact
// contact1.save().then((contact) => console.log(contact));
