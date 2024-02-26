<template>
	<div class="modal fade" id="AddTaskModal" tabindex="-1" role="dialog" aria-hidden="true" v-show="show">
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
								<input type="text" class="form-control" maxlength="100" v-model="taskTitle"
									@submit.prevent="onSubmit" />
							</span>
						</div>

						<div class="form-group container-fluid row">
							<h5 class="col-3">定時</h5>
							<div class="col-9">
								<div class="row">
									<span class="col">
										<input class="form-check-input" type="radio" id="isTimerRadio1" name="isTimerRadio"
											v-model="isTimer" value="0">
										<label class="form-check-label" for="isTimerRadio1">否</label>
									</span>
									<span class="col">
										<input class="form-check-input" type="radio" id="isTimerRadio2" name="isTimerRadio"
											v-model="isTimer" value="1">
										<label class="form-check-label" for="isTimerRadio2">是</label>
									</span>
								</div>

							</div>

						</div>

						<div class="form-group container-fluid" v-if="isTimer == 1">
							<div class="row">
								<h5>設定時間</h5>
							</div>


							<div class="row">
								<h5 class="col-3">日期</h5>
								<span class="col-4">
									<input type="date" v-model="selectedDate">
								</span>
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
								<h5 class="col-3">時刻</h5>
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
										<option v-for="minute in minutes" :key="minute" :value="minute">
											{{ minute.toString().padStart(2, '0') }}
										</option>
									</select>
								</div>
							</div>

							<div class="row">
								<p class="col-2">重複性</p>

								<span class="col">
									<input class="form-check-input" type="radio" id="periodRadio0" name="test" value="0"
										v-model="periodType">
									<label class="form-check-label" for="periodRadio0">不重複</label>
								</span>
								<span class="col">
									<input class="form-check-input" type="radio" id="periodRadio1" name="test" value="10"
										checked v-model="periodType">
									<label class="form-check-label" for="periodRadio1">每日</label>
								</span>
								<span class="col">
									<input class="form-check-input" type="radio" id="periodRadio2" name="test" value="20"
										v-model="periodType">
									<label class="form-check-label" for="periodRadio2">每週</label>
								</span>
								<span class="col">
									<input class="form-check-input" type="radio" id="periodRadio3" name="test" value="30"
										v-model="periodType">
									<label class="form-check-label" for="periodRadio3">每月</label>
								</span>

							</div>
						</div>
					</form>


					<!-- <p>Modal Body</p> -->
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="addClick">OK</button>
					<button type="button" class="btn btn-se" @click="closeModal">關閉</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Modal } from 'bootstrap';
import App from '../App.vue';
import dayjs from 'dayjs';


export default {
	data() {
		return {
			selectedDate: dayjs().format('YYYY-MM-DD'),
			taskTitle: '',
			isTimer: 0,
			selectedHour: 0,
			selectedMinute: 0,
			isPM: 1,
			periodType: this.$root.PERIOD_TYPES.daily,
			minutes: Array.from({ length: 60 }, (_, index) => index.toString())
		}
	},
	props: ['show'],
	watch: {
		show(newVal) {
			let AddTaskModal = document.getElementById('AddTaskModal');
			let modal = Modal.getOrCreateInstance(AddTaskModal);
			if (newVal) {
				modal.show();
			} else {
				modal.hide();
			}
		},
		selectedDate(newDate, oldDate) {
			// Check if the newDate is empty or null
			if (!newDate) {
				// Set the selectedDate to today's date
				this.selectedDate = dayjs().format('YYYY-MM-DD');
			}
		},
		selectedHour(newVal) { if (!newVal) { this.selectedHour = 0; } },
		selectedMinute(newVal) { if (!newVal) { this.selectedMinute = 0; } }
	},
	mounted() {

		const addTaskModal = document.getElementById('AddTaskModal');
		const modal = Modal.getOrCreateInstance(addTaskModal);

		// Emit an event when the modal is hidden
		modal._element.addEventListener('hidden.bs.modal', () => {
			this.$emit('modal-hidden');
		});
	},
	methods: {
		closeModal() {
			let AddTaskModal = document.getElementById('AddTaskModal');
			let modal = Modal.getOrCreateInstance(AddTaskModal);
			modal.hide()
		},
		addClick() {
			// Convert selectedHour and selectedMinute to integers
			const setHour = parseInt(this.selectedHour);
			const setMinute = parseInt(this.selectedMinute);
			const isPM = parseInt(this.isPM);


			let setPeriodType = parseInt(this.periodType)


			// Create the todo time using dayjs
			let setTodoTime;
			if (this.isTimer) {
				setTodoTime = dayjs(this.selectedDate)
					.hour(isPM === 1 && setHour !== 12 ? setHour + 12 : setHour)
					.minute(setMinute)
					.second(0)
					.millisecond(0);
			} else {
				setTodoTime = dayjs().second(0).millisecond(0);
				setPeriodType = this.$root.PERIOD_TYPES.once;
			}

			// Create a new instance of the Timer class using the static method
			const newTimer = App.setup().Timer.createTask(
				this.taskTitle,
				setTodoTime,
				this.isTimer == 1,
				false,
				setPeriodType
			);

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
																																																																																													   																																																																																																																																																																													