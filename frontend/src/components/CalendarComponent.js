import react from 'react';
import PanelComponent from './PanelComponent';
import AuthPrompt from './AuthPrompt';

function calendarComponent(){
    //states:
        //Click to sign in
        //Sign-in process
        //Display calendar
        //Errored
    const [eventData, setEventData] = useState({});
    const [componentState, setComponentState] = useState("loading");
    var authURL = "";

    useEffect(()=>{
        setComponentState("loading");

        if(true /*cookie exists*/){
             fetch("http://192.168.1.127:9000/calendar") //with auth token in req
                .then((res)=>{
                    setEventData(res);
                    setComponentState("displayEvents");
                })
                .catch((err)=>{
                    console.error("Error:", err);
                    setComponentState("error");
                });
         } else {
            fetch("http://192.168.1.127:9000/oauth2/getRedirect").then((res)=>{
                authURL = res;
                setComponentState("authPrompt");
            }).catch((err)=>{
                console.error("Error:", err);
                setComponentState("error");
            })
        }   
    }, []);

    switch(componentState){
        case "error":
            return(
                <PanelComponent title="Calendar">
                    <Error />
                </PanelComponent>
            );
        case "authPrompt":
            return(
                <PanelComponent title="calendar">
                    <AuthPrompt url={authURL} />
                </PanelComponent>
            );
        case "displayEvents":
            return(
                <div id="calendar">
                    {/* list of events */}
                    events go here
                </div>
            )
    }
    
    return(
        <PanelComponent title="Calendar">
            <p>Loading...</p>
        </PanelComponent>
    )

}