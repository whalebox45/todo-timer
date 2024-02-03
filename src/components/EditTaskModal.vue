<template>
	<div class="modal fade" id="EditTaskModal" tabindex="-1" role="dialog" aria-hidden="true" v-show="show">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">編輯項目</h5>
					<button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
				</div>
				<div class="modal-body">
					<form>
						<div class="form-group container-fluid row">
							<h5 :title="id" class="col-3">標題</h5>
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

									<select class="form-control " v-model="selectedHour">
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

									<select class="form-control " v-model="selectedMinute">
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

					<div class="form-group container-fluid row">
						<h5 class="col-3">刪除</h5>
						<div class="col-7"></div>
						<button type="button" class="col-2 btn btn-danger" @click="deleteClick">刪除</button>
					</div>
					<!-- <p>Modal Body</p> -->
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="saveClick">OK</button>
					<button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Modal } from 'bootstrap';


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
	props: ['show', 'editTaskData'],
	watch: {
		editTaskData: {
			immediate: true, // Log the initial value
			handler(newVal) {

				// Update taskTitle based on the new value of editTaskData
				if (newVal) {
					this.id = newVal.id;
					this.taskTitle = newVal.taskTitle;
					this.isPeriodical = newVal.isPeriodical ? 1 : 0;
					if (newVal.isPeriodical) {
						const timeHour = Math.floor(newVal.refreshTime / 3600);
						const timeMinute = Math.floor(newVal.refreshTime / 60 % 60);
						this.isPM = (timeHour >= 12) ? 1 : 0;
						this.selectedHour = timeHour % 12;
						this.selectedMinute = timeMinute;
					}
				}
			},
		},


		show(newVal) {
			// Show or hide the modal using Bootstrap's Modal API
			const editTaskModal = document.getElementById('EditTaskModal');
			const modal = Modal.getOrCreateInstance(editTaskModal);

			if (newVal) {
				modal.show();
			} else {
				modal.hide();
			}
		},
	},
	mounted() {

		const editTaskModal = document.getElementById('EditTaskModal');
		const modal = Modal.getOrCreateInstance(editTaskModal);

		// Emit an event when the modal is hidden
		modal._element.addEventListener('hidden.bs.modal', () => {
			this.$emit('modal-hidden');
		});
	},
	methods: {
		closeModal() {
			let AddTaskModal = document.getElementById('EditTaskModal');
			let modal = Modal.getOrCreateInstance(AddTaskModal);
			modal.hide()
		},
		saveClick() {
			let timeInSeconds = this.selectedHour * 3600 + this.selectedMinute * 60;
			const isPM = parseInt(this.isPM)

			if (isPM === 1) timeInSeconds += 12 * 3600;

			const isPeriodical = parseInt(this.isPeriodical);

			this.$root.updateTimerById(this.id, {
				taskTitle: this.taskTitle,
				refreshTime: isPeriodical === 1 ? timeInSeconds : 0,
				isPeriodical: isPeriodical === 1,
			});

			// Save the updated timerDataArray to localStorage
			localStorage.setItem('TimerDataArrayStorage', JSON.stringify(this.$root.timerDataArray));

			this.closeModal();
		},
		deleteClick() {
			if (confirm("Are you sure you want to delete this task?")) {
				this.$root.deleteTimerById(this.editTaskData.id);

				localStorage.setItem('TimerDataArrayStorage', JSON.stringify(this.$root.timerDataArray));

				this.closeModal();
			}
		}
	}
};
</script>