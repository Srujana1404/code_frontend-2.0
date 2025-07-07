import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import ContestCard from "../../components/Details_test/ContestCard";
import InfoTable from "../../components/Details_test/InfoTable";


interface contestdata {
    id: number;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    status: string;
}

interface contestDetails {
    total_questions: number;
    total_score: number;
    total_negative_marks: number;
}


function Contest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contestdata, setContestdata] = useState<contestdata | null>(null);
    const [contestDetails, setContestDetails] = useState<contestDetails | null>(null);


    useEffect(() => {
        // Replace with your actual backend API endpoint
        Axios.get(`/api/contests/${id}`)
            .then(response => setContestdata((response.data as { contestdata: contestdata }).contestdata))
            .catch(error => console.error("Error fetching contest:", error));
    }, [id]);


    useEffect(() => {
        // Replace with your actual backend API endpoint
        Axios.get(`/api/contestDetails/${id}`)
            .then(response => setContestDetails((response.data as { contestDetails: contestDetails }).contestDetails))
            .catch(error => console.error("Error fetching question count:", error));
    }, [id]);


    const handleStart = () => {
        navigate(`/contests/${id}/mcqs`);
    };

    if (!contestdata) return <div>Loading...</div>;  //todo loading scrren

    return (
        <>
            <ContestCard
                title={contestdata.name}
                description={contestdata.description}
                status={contestdata.status}
            />
            {/* InfoTable */}
            <InfoTable
                totalQuestions={contestDetails?.total_questions ?? 0}
                totalScore={contestDetails?.total_score ?? 0}
                // totalNegativeMarks={contestDetails?.total_negative_marks ?? 0}  
                contestDuration={
                    (
                        () => {
                            const durationMs = new Date(contestdata.end_time).getTime() - new Date(contestdata.start_time).getTime();
                            const minutes = Math.floor(durationMs / 60000);
                            const hours = Math.floor(minutes / 60);
                            const mins = minutes % 60;
                            return `${hours}h ${mins}m`;
                        }
                    )()
                }
                startTime={new Date(contestdata.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                endTime={new Date(contestdata.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 onStart={handleStart} />

        </>


    );
}

export default Contest;
