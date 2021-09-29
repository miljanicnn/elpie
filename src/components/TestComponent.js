const myelement = React.createElement("h1", {}, "I do not use JSX!");
ReactDOM.render(myelement, document.getElementById("root"));

const osoba1 = { ime: "Marko", starost: 16 };
const osoba2 = { ime: "Maja", starost: 25 };
const element1 = (
	<h1>
		Osoba {osoba1.ime} je {osoba1.starost < 18 ? "maloletna" : "punoletna"}
	</h1>
);
// Vraca: 'Osoba Marko je maloletna'
const element2 = (
	<h1>
		Osoba {osoba2.ime} je {osoba2.starost < 18 ? "maloletna" : "punoletna"}
	</h1>
);

{
	/* <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center items-center sm:py-12">
  <div class="h-16 w-16 rounded-full bg-indigo-600" />
</div>

<div class="min-h-screen bg-gray-100 flex justify-center items-center">
  <div class="h-16 w-16 rounded-full bg-indigo-600 sm:bg-red-600" />
</div> */
}
