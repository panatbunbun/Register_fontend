const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE'
let selectedId = '' //ตัวแปรแบบ Golbal ใช้ได้ทุกที่

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  console.log('id', id)
  if (id) {
    mode = 'EDIT'
    selectedId = id

    try {
      const response = await axios.get(`${BASE_URL}/user/${id}`)
      const user = response.data

      let FirstNameDOM = document.querySelector('input[name=Firstname]')
      let LastNameDOM = document.querySelector('input[name=Lastname]')
      let ageDOM = document.querySelector('input[name=age]')
      let congenitaldisorderDOM = document.querySelector('input[name=congenitaldisorder]')
      let Servicedate = document.querySelector('input[name=Servicedate]')
      let IllnessDOM = document.querySelector('input[name=Illness]')
      let Diagnosedisease = document.querySelector('input[name=Diagnosedisease]')
      let Treatmentandmedicine = document.querySelector('input[name=Treatmentandmedicine]')
      let Appointmentdate = document.querySelector('input[name=Appointmentdate]')
      let doctorappointment = document.querySelector('input[name=doctorappointment]')
      let Appointmentdetails = document.querySelector('textarea[name=Appointmentdetails]')

    const date1 = new Date(user.Servicedate);
    const date2 = new Date(user.Appointmentdate);
    const formattedDate1 = date1.toISOString().split('T')[0];
    const formattedDate2 = date2.toISOString().split('T')[0];

      user.Servicedate = formattedDate1
      user.Appointmentdate = formattedDate2
      FirstNameDOM.value = user.Firstname
      LastNameDOM.value = user.Lastname
      ageDOM.value = user.age
      congenitaldisorderDOM.value = user.congenitaldisorder
      Servicedate.value = user.Servicedate
      IllnessDOM.value = user.Illness
      Diagnosedisease.value = user.Diagnosedisease
      Treatmentandmedicine.value = user.Treatmentandmedicine
      Appointmentdate.value = user.Appointmentdate
      doctorappointment.value = user.doctorappointment
      Appointmentdetails.value = user.Appointmentdetails
     

      let genderDOMs = document.querySelectorAll('input[name=gender]')
      

      for (let i = 0; i < genderDOMs.length; i++) {
        if (genderDOMs[i].value == user.gender) {
          genderDOMs[i].checked = true
        }
      }

      

    } catch (error) {
      console.log('error', error)
    }
  }
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
  
  const submitData = async () => {
    let FirstNameDOM = document.querySelector('input[name=Firstname]')
    let LastNameDOM = document.querySelector('input[name=Lastname]')
    let ageDOM = document.querySelector('input[name=age]')
    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let congenitaldisorderDOM = document.querySelector('input[name=congenitaldisorder]')
    let Servicedate = document.querySelector('input[name=Servicedate]')
    let IllnessDOM = document.querySelector('input[name=Illness]')
    let Diagnosedisease = document.querySelector('input[name=Diagnosedisease]')
    let Treatmentandmedicine = document.querySelector('input[name=Treatmentandmedicine]')
    let Appointmentdate = document.querySelector('input[name=Appointmentdate]')
    let doctorappointment = document.querySelector('input[name=doctorappointment]')
    let Appointmentdetails = document.querySelector('textarea[name=Appointmentdetails]')
    

    const date = new Date()
    let messageDOM = document.getElementById('message')

    try {
      console.log('test')
      let userData = {
        Firstname: FirstNameDOM.value,
        Lastname: LastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        congenitaldisorder: congenitaldisorderDOM.value,
        Servicedate: Servicedate.value,
        Illness: IllnessDOM.value,
        Diagnosedisease: Diagnosedisease.value,
        Treatmentandmedicine: Treatmentandmedicine.value,
        Appointmentdate: Appointmentdate.value,
        doctorappointment: doctorappointment.value,
        Appointmentdetails: Appointmentdetails.value
      }
      console.log('submit data',userData)

      const errors = validateData(userData)

      if (errors.length > 0) {
        throw {
          message: 'กรอกข้อมูลไม่ครบ!',
          errors: errors
        }
      }

      let message = 'บันทึกข้อมูลสำเร็จ!'

      if(mode == 'CREATE'){
        const response = await axios.post(`${BASE_URL}/user`, userData)
        console.log('response', response.data)
      } else {
        const response = await axios.put(`${BASE_URL}/user/${selectedId}`, userData)
        message = 'แก้ไขข้อมูลสำเร็จ!'
        console.log('response', response.data)
      }
      messageDOM.innerText = message
      messageDOM.className = 'message success'

    } catch (error) {
      console.log('error message', error.message)
      console.log('error', error.erros)
      if (error.response) {
        console.log(error.response)
        error.message = error.response.data.message
        error.errors = error.response.data.errors
      }

      let htmlData = '<div>'
      htmlData += `<div>${error.message}</div>`
      htmlData += '<ul>'
      for (let i = 0; i < error.errors.length; i++) {
        htmlData += `<li>${error.errors[i]}</li>`
      }
      htmlData += '</ul>'
      htmlData += '<div>'


      messageDOM.innerHTML = htmlData
      messageDOM.className = 'message danger'
    }
     
  }
