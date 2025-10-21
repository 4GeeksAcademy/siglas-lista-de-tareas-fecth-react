import React from "react";
import Tareas from "./Tareas";

//create your first component
const Home = () => {
	return (
		<div className="container">
			<div className="card marco dshadow-sm">
				<h1 className="text-center mt-3">To-Do List</h1>
				<Tareas />
			</div>
		</div>
	);
};

export default Home;