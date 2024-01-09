import React, {useState} from 'react'
import axios from 'axios'

const BookingForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        date: window.history.state.usr.date,
        time: window.history.state.usr.slot
    })

    console.log(window.history.state)

    console.log(formData)

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/booking/finalize', formData )
    }

  return (
      <div>
          <form action="" method='post' onSubmit={handleSubmit}>
              <label htmlFor="name">name</label>
              <input type="text" name='name' id='name' onChange={handleChange}/>
              <label htmlFor="last_name">lastname</label>
              <input type="text" name='last_name' id='last_name'onChange={handleChange} />
              <label htmlFor="email">email</label>
              <input type="email" name='email' id='email' onChange={handleChange}/>
              <label htmlFor="phone">phone</label>
              <input type="text" name='phone' id='phone' onChange={handleChange}/>
              <input type="submit" value="Book Time" />
          </form>
    </div>
  )
}

export default BookingForm
