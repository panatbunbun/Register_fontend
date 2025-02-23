const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')
const app = express()

app.use(bodyparser.json())
app.use(cors())

const port = 8000

let conn = null

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8820
  })
}

const validateData = (userData) => {
  let errors = []
  if (!userData.Firstname) {
    errors.push('กรุณากรอกชื่อ')
  }
  if (!userData.Lastname) {
    errors.push('กรุณากรอกนามสกุล')
  }
  if (!userData.age) {
    errors.push('กรุณากรอกอายุ')
  }
  if (!userData.gender) {
    errors.push('กรุณาเลือกเพศ')
  }
  if (!userData.congenitaldisorder) {
    errors.push('กรุณาโรคประจำตัว')
  }
  if (!userData.Servicedate) {
    errors.push('กรุณาวันที่รับบริการ')
  }
  if (!userData.Illness) {
    errors.push('กรุณาอาการเบื้องต้น')
  }
  if (!userData.Diagnosedisease) {
    errors.push('กรุณาการวินิจฉัย')
  }
  if (!userData.Treatmentandmedicine) {
    errors.push('กรุณาการรักษาและยาที่ให้')
  }
  if (!userData.Appointmentdate) {
    errors.push('กรุณาวันนัดหมาย')
  }
  if (!userData.doctorappointment) {
    errors.push('กรุณาแพทย์ผู้นัดหมาย')
  }
  if (!userData.Appointmentdetails) {
    errors.push('กรุณารายละเอียดการนัดหมาย')
  }

  return errors
}

// path = GET /user สำหรับ get user ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/user', async (req, res) => {
  const results = await conn.query('SELECT * FROM user')
  res.json(results[0])
})

// path = POST /user สำหรับการสร้าง user ใหม่บันทึกเข้าไป
app.post('/user', async (req, res) => {
  try {
      let users = req.body

      const errors = validateData(users)
      if (errors.length > 0) {
        throw { 
          message: 'กรอกข้อมูลไม่ครบ',
          errors: errors }
      }
      const results = await conn.query('INSERT INTO user SET ?', users)
      res.json({
        message: 'insert ok',
        data: results[0]
      })
  } catch (error) {
      const errorMessage = error.message || 'something wrong'
      const errors = error.errors || []
      console.error('error message', error.message)
      res.status(500).json({
        message: errorMessage,
        errors: errors
      })
  }
})

// GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/user/:id', async (req, res) => {
  try {
    let id = req.params.id
    const results = await conn.query('SELECT * FROM user WHERE id = ?', id)

    if (results[0].length == 0) {
      throw { statusCode: 404, message: 'หาไม่เจอ' }
    }

    res.json(results[0][0])
  } catch (error) {
    console.error('error message', error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'something wrong',
      errorMessage: error.message
    })
  }
})

// path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/user/:id', async (req, res) => {
  try {
    let id = req.params.id
    let updateUser = req.body
    const results = await conn.query(
      'UPDATE user SET ? WHERE id = ?',
      [updateUser, id]
    )
    res.json({
      message: 'update ok',
      data: results[0]
    })
  } catch (error) {
    console.error('error message', error.message)
    res.status(500).json({
      message: 'something wrong'
    })
  }
})


// path DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/user/:id', async (req, res) => {
  try {
    let id = req.params.id
    const results = await conn.query('DELETE from user WHERE id = ?', parseInt(id))
    res.json({
      message: 'delete ok',
      data: results[0]
    })
  } catch (error) {
    console.error('error message', error.message)
    res.status(500).json({
      message: 'something wrong'
    })
  }
})

app.listen(port, async (req, res) => {
  await initMySQL()
  console.log('http server run at ' + port)
})