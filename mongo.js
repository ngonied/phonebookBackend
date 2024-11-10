const mongoose = require('mongoose')





const password = process.argv[2]

const url =  `mongodb+srv://ngoniechizororo:${password}@cluster0.8mnse.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
mongoose.connect(url)

if (process.argv.length<4) {
  console.log('Phonebook: ')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

}else{

  const nameInput = String(process.argv[3])
  const numberInput = String(process.argv[4])



  const person = new Person({
    name: nameInput,
    number: numberInput,
  })

  person.save().then(result => {
    console.log(`added ${nameInput} number ${numberInput} to phonebook`)
    mongoose.connection.close()
  })


}








