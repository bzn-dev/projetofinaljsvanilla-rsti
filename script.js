let parkingSpaces = [];
let occupiedSpaces = [];
let parkedCars = {};
let vehicleRates = {
	1: 2, // Carro
	2: 1.5, // Moto
	3: 3, // Caminhão
};
let totalRevenue = 0;

function addParkingSpace() {
	const newSpace = { id: parkingSpaces.length + 1 };
	parkingSpaces.push(newSpace);
	updateParkingInfo();
}

function removeParkingSpace() {
	if (parkingSpaces.length > 0) {
		const lastSpace = parkingSpaces.pop();
		if (!occupiedSpaces.includes(lastSpace.id)) {
			updateParkingInfo();
		} else {
			alert("Não é possível remover uma vaga ocupada.");
			parkingSpaces.push(lastSpace);
		}
	}
}

function removeParkingSpaceById() {
	const id = prompt("Por favor, insira o ID da vaga a ser removida:");
	if (id !== null) {
		const index = parkingSpaces.findIndex((space) => space.id === parseInt(id));
		if (index !== -1) {
			if (!occupiedSpaces.includes(id)) {
				parkingSpaces.splice(index, 1);
				updateParkingInfo();
				alert("Vaga removida com sucesso.");
			} else {
				alert("Não é possível remover uma vaga ocupada.");
			}
		} else {
			alert("ID de vaga não encontrado.");
		}
	}
}

function carEntry() {
	let plate;
	do {
		plate = prompt("Por favor, insira a placa do veículo (7 dígitos):");
		if (plate !== null) {
			plate = plate.toUpperCase();
		}
	} while (plate !== null && (plate.length !== 7 || parkedCars[plate]));

	if (plate !== null) {
		let vehicleType;
		do {
			vehicleType = prompt(
				"Por favor, selecione o tipo de veículo:\n1 - Carro\n2 - Moto\n3 - Caminhão"
			);
		} while (!vehicleRates[vehicleType] && vehicleType !== null);

		if (vehicleType !== null) {
			if (parkingSpaces.length > 0) {
				const parkedCar = parkingSpaces.pop();
				occupiedSpaces.push(parkedCar.id);
				parkedCars[plate] = {
					spaceId: parkedCar.id,
					entryTime: new Date(),
					vehicleType: vehicleType,
				};
				updateParkingInfo();
				alert(
					"Veículo estacionado. Placa: " +
						plate +
						", ID da Vaga: " +
						parkedCar.id
				);
			} else {
				alert("Não há vagas disponíveis.");
			}
		}
	}
}

function carExit() {
	let plate;
	do {
		plate = prompt("Por favor, insira a placa do veículo:");
		if (plate !== null) {
			plate = plate.toUpperCase();
		}
	} while (plate !== null && !parkedCars[plate]);

	if (plate !== null) {
		const parkedCar = parkedCars[plate];
		const exitTime = new Date();
		const entryTime = parkedCar.entryTime;
		const hours = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));
		const rate = vehicleRates[parkedCar.vehicleType];
		const cost = hours * rate;
		alert(
			"Tempo estacionado: " +
				hours +
				" horas. Valor devido: R$" +
				cost.toFixed(2)
		);
		totalRevenue += cost;
		delete parkedCars[plate];
		const index = occupiedSpaces.indexOf(parkedCar.spaceId);
		if (index > -1) {
			occupiedSpaces.splice(index, 1);
		}
		parkingSpaces.push({ id: parkedCar.spaceId });
		updateParkingInfo();
		updateHUD();
	}
}

function updateParkingInfo() {
	const availableSpacesList = document.getElementById("available-spaces");
	const occupiedSpacesList = document.getElementById("occupied-spaces");

	availableSpacesList.innerHTML = "";
	occupiedSpacesList.innerHTML = "";

	parkingSpaces.forEach((space) => {
		const listItem = document.createElement("li");
		listItem.textContent = "ID: " + space.id;
		availableSpacesList.appendChild(listItem);
	});

	occupiedSpaces.forEach((id) => {
		const listItem = document.createElement("li");
		listItem.textContent = "ID: " + id;
		occupiedSpacesList.appendChild(listItem);
	});

	const carInfoDiv = document.getElementById("car-info");
	carInfoDiv.innerHTML = "<h3>Veículos Estacionados:</h3>";
	for (const plate in parkedCars) {
		const car = parkedCars[plate];
		const entryTime = car.entryTime.toLocaleString();
		let vehicleTypeString;
		switch (car.vehicleType) {
			case "1":
				vehicleTypeString = "Carro";
				break;
			case "2":
				vehicleTypeString = "Moto";
				break;
			case "3":
				vehicleTypeString = "Caminhão";
				break;
			default:
				vehicleTypeString = "Desconhecido";
		}
		carInfoDiv.innerHTML +=
			"<p>Placa: " +
			plate +
			", ID da Vaga: " +
			car.spaceId +
			", Tipo: " +
			vehicleTypeString +
			", Entrada: " +
			entryTime +
			"</p>";
	}
}

function updateHUD() {
	const moneyCounter = document.getElementById("money-counter");
	moneyCounter.textContent = totalRevenue.toFixed(2);
}
