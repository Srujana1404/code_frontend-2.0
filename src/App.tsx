import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Contest from "./Pages/Contest/Contest";
// import Upload from "./Pages/Upload/Upload";
import ContestOver from "./Pages/ContestOver/ContestOver";
import DisQualified from "./Pages/DisQualified/DisQualified";
import { ContestProvider } from "./components/common/contestContext";
import MCQQuiz from "./Pages/MCQQuiz/MCQQuiz";
import TestUpcoming from "./Pages/TestUpcoming/TestUpcoming";
import AdminLayout from "./components/Custom/AdminLayout";
import ContestCreator from "./Pages/ContestCreater/contestCreator";
import PreviewContest from "./Pages/ContestCreater/previewContest";
import Results from "./Pages/Results/Results";
import ExamManagement from "./Pages/ExamManagment/ExamManagement";
import { ContestDataProvider } from "./components/Details_test/ContestDataContext";



const router = createBrowserRouter([
  {
    path: "/contests/:id",
    element: <Contest />,
  },
  {
    path: "/contests/:id/mcqs",
    element: (
      // <ContestDataProvider>
        <MCQQuiz />
      // </ContestDataProvider>
    ),
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
    path: "/upcomingtest",
    element: <TestUpcoming />
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "results", // ✅ relative to /admin
        element: <Results />,
      },
      {
        path: "exammanagement",
        element: <ExamManagement />,
      },
      {
        path: "contestcreator",
        element: (
          <ContestProvider>
            <ContestCreator />
          </ContestProvider>
        ),
      },
      {
        path: "preview",
        element: (
          <ContestProvider>
            <PreviewContest />
          </ContestProvider>
        )
      },
    ],
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;