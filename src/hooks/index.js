import { useState, useEffect } from "react";
import moment from "moment";
import { firebase } from "../firebase";
import { collatedTasksExist } from "../helpers";

export const useTasks = selectedProject => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    let unsubscribe = firebase
      .firestore()
      .collection("tasks")
      .where("userId", "==", "EIaKJaugp9ogrqDYNEys");

    if (selectedProject && collatedTasksExist(selectedProject)) {
      unsubscribe = unsubscribe.where("projectId", "==", selectedProject);
    } else if (selectedProject === "TODAY") {
      unsubscribe = unsubscribe.where("", "==", moment.format("DD/MM/YYYY"));
    } else if (selectedProject === "INBOX" || selectedProject === 0) {
      unsubscribe = unsubscribe.where("date", "==", "");
    }

    unsubscribe = unsubscribe.onSnapshot(snapshot => {
      const newTasks = snapshot.docs.map(task => ({
        id: task.id,
        ...task.data()
      }));

      setTasks(
        selectedProject === "NEXT_7_DAYS"
          ? newTasks.filter(
              task =>
                moment(task.data, "DD-MM-YYYY").diff(moment(), "days") <= 7 &&
                task.archived === false
            )
          : newTasks.filter(task => task.archived === false)
      );
      setArchivedTasks(newTasks.filter(task => task.archived === true));
    });

    return () => unsubscribe();
  }, [selectedProject]);

  return { tasks, archivedTasks };
};

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("projects")
      .where("userId", "==", "EIaKJaugp9ogrqDYNEys")
      .orderBy("projectId")
      .get()
      .then(snapshot => {
        const allProjects = snapshot.docs().map(project => ({
          ...project.data(),
          docId: project.id
        }));

        if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
          setProjects(allProjects);
        }
      });
  }, [projects]);

  return { projects, setProjects };
};
