<template>
	<div class="modal fade" id="AddTaskModal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">新增項目</h5>
					<button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
				</div>
				<div class="modal-body">
					<form>
						<div class="form-group container-fluid row">
							<h5 class="col-3">標題</h5>
							<span class="col-9">
								<input type="text" class="form-control" maxlength="100" v-model="taskTitle" />
							</span>
						</div>

						<div class="form-group container-fluid row">
							<h5 class="col-3">週期性</h5>
							<span class="col-3">

								<input class="form-check-input" type="radio" id="periodRadio1" name="periodRadio"
									v-model="isPeriodical" value="0">
								<label class="form-check-label" for="periodRadio1">否</label>
							</span>
							<span class="col-3">

								<input class="form-check-input" type="radio" id="periodRadio2" name="periodRadio"
									v-model="isPeriodical" value="1">
								<label class="form-check-label" for="periodRadio2">是</label>
							</span>
						</div>

						<div class="form-group container-fluid" v-if="isPeriodical == 1">
							<div class="row">
								<h5 class="col-3">重置時間</h5>
								<span class="col-4">

									<input class="form-check-input" type="radio" id="isPMRadio1" name="isPMRadio"
										v-model="isPM" value="1">
									<label class="form-check-label" for="isPMRadio1">下午</label>

									<input class="form-check-input" type="radio" id="isPMRadio2" name="isPMRadio"
										v-model="isPM" value="0">
									<label class="form-check-label" for="isPMRadio2">上午</label>
								</span>
							</div>

							<div class="row">
								<div class="col-3">
									<select class="form-control" v-model="selectedHour">
										<option selected value="0">12</option>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
										<option>6</option>
										<option>7</option>
										<option>8</option>
										<option>9</option>
										<option>10</option>
										<option>11</option>
									</select>

								</div>
								
								<span class="col-1">:</span>
								<div class="col-3">

									<select class="form-control" v-model="selectedMinute">
										<option selected value="0">00</option>
										<option>10</option>
										<option>20</option>
										<option>30</option>
										<option>40</option>
										<option>50</option>
									</select>
								</div>
							</div>
						</div>
					</form>


					<!-- <p>Modal Body</p> -->
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="addClick">OK</button>
					<button type="button" class="btn btn-se" @click="closeModal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Modal } from 'bootstrap';
import App from '../App.vue';


export default {
	data() {
		return {
			taskTitle: '',
			isPeriodical: 0,
			selectedHour: 0,
			selectedMinute: 0,
			isPM: 1,
		}
	},
	props: [],
	methods: {
		closeModal() {
			let AddTaskModal = document.getElementById('AddTaskModal');
			let modal = Modal.getOrCreateInstance(AddTaskModal);
			modal.hide()
		},
		addClick() {
			let timeInSeconds = this.selectedHour * 3600 + this.selectedMinute * 60;
			const isPM = parseInt(this.isPM)

			if (isPM === 1) timeInSeconds += 12 * 3600;

			const isPeriodical = parseInt(this.isPeriodical);

			// Create a new instance of the Timer class using the static method
			const newTimer = App.setup().Timer.createTask(this.taskTitle, isPeriodical === 1 ? timeInSeconds : 0, isPeriodical === 1, false);

			// Access the timerDataArray from the root Vue instance
			this.$root.timerDataArray.push(newTimer);

			// Save the updated timerDataArray to localStorage
			localStorage.setItem('TimerDataArrayStorage', JSON.stringify(this.$root.timerDataArray));

			// Close the modal
			this.closeModal();
		}
	}
};
</script>