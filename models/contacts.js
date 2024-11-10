const mongoose = require('mongoose')
require('dotenv').config()




const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url).then(
    result=>{
        console.log('connected to MongoDB')
    }
).catch(error =>{
    console.log('error connecting to MongoDb: ', error.message)
})

const personSchema = new mongoose.Schema({
  name: {type: String,
    minLength: [3, 'the name too short'],
    required: [true, 'name is required']
  },
  number: {type: String, 
    minLength: [8, 'A phone number must have a minimum 8 characters'],
    validate: {
      validator: function(v) {
        return /^(?=.{8,})(\d{2,3})-(\d+)$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'phone number required']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject)=>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)