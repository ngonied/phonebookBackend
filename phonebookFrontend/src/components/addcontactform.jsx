
export const AddUser = ({ addNewName, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addNewName} id="addnum">
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>

      <br />

      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>

      <div>
        <button type="submit">add</button>

      </div>
    </form>
  )
}
