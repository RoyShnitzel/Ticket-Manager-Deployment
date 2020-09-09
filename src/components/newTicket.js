import React,{useState, useEffect} from 'react';
import axios from 'axios';

function NewTicketPopUp(props) {
    const [submitted, setSubmitted] = useState(true);
    const [titleInput, setTitleInput] = useState();
    const [contentInput, setContentInput] = useState();
    const [emailInput, setEmailInput] = useState();
    const [labelsInput, setLabelsInput] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (labelsInput === '') {
        const body = {
          title: titleInput,
          content: contentInput,
          userEmail: emailInput,
          creationTime: `${Date.now()}`,
        };
        const res = await axios({method: 'post', url: '/addticket', data: body});
        console.log(res.data)
        if (res.data === 'Submitted') {
            setSubmitted(false);
          }
      } else {
        const labelsArr = labelsInput.split(',');
        const body = {
          title: titleInput,
          content: contentInput,
          userEmail: emailInput,
          creationTime: Date.now(),
          labels: labelsArr,
        };
        const res = await axios.post('/addticket', body);
        console.log(res.data)
        if (res.data === 'Submitted') {
            setSubmitted(false);
          }
      }
    };

    useEffect(() => {
        return () => {
          const getTickets = async () => {
            const { data } = await axios.get(`/api/tickets?page=1&limit=10&sort=false`);
            props.setTickets(data);
            const allTicketsData = await axios.get(`/api/tickets`)
            props.setAllTickets(allTicketsData.data)
            props.setPage(2)
            props.setValueOfInput('')
            data.length<10? props.setHasMore(false):props.setHasMore(true);
            props.setDisplay(false)
          };
          if(!submitted){
          getTickets();
          }
        };
      },[submitted]);

  return (
     <div className="newTicketPopUp">
        {submitted? <div className="formStyle">
        <div className='popUpHeader'>
        <h2>Enter New Ticket</h2>
        <button onClick={()=>props.func(false)} className ="close">close</button>
        </div>
        <form action="/action_page.php" method="post" onSubmit={(e)=>handleSubmit(e)}>
        <label>
        Enter Ticket Title:<br/>
        <input placeholder="Title..." type="text" name="title" onChange={(e)=>setTitleInput(e.target.value)} required/>
        </label>
        <br/>
        <label>
        Enter Ticket Content:<br/>
        <textarea placeholder="Content..." type="text" name="content" onChange={(e)=>setContentInput(e.target.value)} required/>
        </label>
        <br/>
        <label>
        Enter Your Email:<br/>
        <input placeholder="Email..." type="email" name="email" onChange={(e)=>setEmailInput(e.target.value)} required/>
        </label>
        <br/>
        <label>
        Enter Ticket Labels:<br/>
        <input placeholder="Enter Labels separated by ',' (optional)" type="text" name="ticketLabel" onChange={(e)=>setLabelsInput(e.target.value)} required/>
        </label>
        <br/>
        <input type="submit" value="Submit" />
        </form>
      </div>
    :
    <div className="formStyle">
    <div className='popUpHeader'>
    <h2>Thank You</h2>
    <button onClick={()=>props.func(false)} className ="close">close</button>
    </div>
    <p>Your ticket has been added</p>
    </div>}
    </div>
  );
}

export default NewTicketPopUp;
