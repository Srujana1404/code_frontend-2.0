import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Contest from "./Pages/Contest/Contest";
// import Upload from "./Pages/Upload/Upload";
import ContestOver from "./Pages/ContestOver/ContestOver";
import DisQualified from "./Pages/DisQualified/DisQualified";
import ContestCreator from "./components/contestCreater(A)/contestCreator";
import { ContestProvider } from "./components/contestCreater(A)/contestContext";
import PreviewContest from "./components/contestCreater(A)/previewContest";
import MCQQuiz from "./Pages/MCQQuiz/MCQQuiz";
import TestUpcoming from "./components/Details_test/TestUpcoming";

const router = createBrowserRouter([
  {
    path: "/contests/:id",
    element: <Contest />,
  },
  {
    path: "/contests/:id/mcqs",
    element: <MCQQuiz />,
  },
  // {
  //   path: "/upload",
  //   element: <Upload />,
  // },
  {
    path: "/contest-over",
    element: <ContestOver />,
  },
  {
    path: "/disqualified",
    element: <DisQualified />,
  },
  {
    path: "/contestcreator",
    element: (
      <ContestProvider>
        <ContestCreator />
      </ContestProvider>
    ),
  },
  {
    path: "/preview",
    element: (
      <ContestProvider>
        <PreviewContest />
      </ContestProvider>
    )
  },
  {
    path: "/upcomingtest",
    element: <TestUpcoming />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;