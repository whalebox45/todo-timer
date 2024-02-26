<template>
	<div class="modal fade" id="EditTaskModal" tabindex="-1" role="dialog" aria-hidden="true" v-show="show">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" :title="formattedData">編輯項目</h5>
					<button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
				</div>
				<div class="modal-body">
					<form>
						<div class="form-group container-fluid row">
							<h5 :title="id" class="col-3">標題</h5>
							<span class="col-9">
								<input type="text" class="form-control" maxlength="100" v-model="taskTitle" 
									@submit.prevent="onSubmit" />
							</span>
						</div>

						<div class="form-group container-fluid row">
							<h5 class="col-3">定時</h5>
							<span class="col-3">
								<input class="form-check-input" type="radio" id="isTimerRadio1" name="isTimerRadio"
									v-model="isTimer" value="0">
								<label class="form-check-label" for="isTimerRadio1">否</label>
							</span>
							<span class="col-3">
								<input class="form-check-input" type="radio" id="isTimerRadio2" name="isTimerRadio"
									v-model="isTimer" value="1">
								<label class="form-check-label" for="isTimerRadio2">是</label>
							</span>
						</div>

						<div class="form-group container-fluid" v-if="isTimer == 1">
							<div class="row">
								<h5>重置時間</h5>
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

									<select class="form-control" v-model="selectedMinute">
										<!-- <option selected value="0">00</option> -->
										<option v-for="minute in minutes" :key="minute" :value="minute">{{
											minute.toString().padStart(2, '0') }}</option>
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
										 v-model="periodType">
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
					<hr class="border border-dark" />
					<div class="form-group container-fluid row">
						<h5 class="col-3">刪除</h5>
						<div class="col-7"></div>
						<button type="button" class="col-2 btn btn-danger" @click="deleteClick">刪除</button>
					</div>
					<!-- <p>Modal Body</p> -->
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="saveClick">OK</button>
					<button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Modal } from 'bootstrap';
import dayjs from 'dayjs';
export default {
	data() {
		return {
			selectedDate: dayjs().format('YYYY-MM-DD'),
			taskTitle: '',
			isTimer: 0,
			periodType: 0,
			selectedHour: 0,
			selectedMinute: 0,
			isPM: 1,
			minutes: Array.from({ length: 60 }, (_, index) => index.toString())
		}
	},
	props: ['show', 'editTaskData'],
	watch: {
		selectedDate(newdate, olddate) {
			console.log(newdate, 'picked')
			if (!newdate) {
				this.selectedDate = dayjs().format('YYYY-MM-DD');
			}
		},
		selectedHour(newVal){ if(!newVal){this.selectedHour = 0;} },
		selectedMinute(newVal){ if(!newVal){this.selectedMinute = 0;} },
		editTaskData: {
			immediate: true, // Log the initial value
			handler(newVal) {
				// Update taskTitle based on the new value of editTaskData
				if (newVal) {
					this.id = newVal.id;
					this.taskTitle = newVal.taskTitle;
					this.isTimer = newVal.isTimer ? 1 : 0;
					this.periodType = newVal.periodType;
					if (newVal.isTimer) {
						// console.log(newVal.setTodoTime);

						const timedayjs = dayjs(newVal.setTodoTime);

						const timeHour = timedayjs.hour();
						const timeMinute = timedayjs.minute();
						this.isPM = (timeHour >= 12) ? 1 : 0;
						this.selectedHour = timeHour % 12;
						this.selectedMinute = timeMinute;

						this.selectedDate = dayjs(timedayjs).format('YYYY-MM-DD');
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
	computed:{
		formattedData() {
			// Format your data here
			return `Task ID: ${this.id}\n Task Title: ${this.taskTitle}\n Is Timer: ${this.isTimer}\n Selected Date: ${this.selectedDate} ${this.selectedHour}:${this.selectedMinute} ${this.isPM ? 'PM':'AM'}\n Period Type: ${this.periodType}`;
		}
	},
	methods: {
		closeModal() {
			let AddTaskModal = document.getElementById('EditTaskModal');
			let modal = Modal.getOrCreateInstance(AddTaskModal);
			modal.hide()
		},
		saveClick() {
			// console.log(this.selectedDate, this.selectedHour, this.selectedMinute);
			// let timeInSeconds = this.selectedHour * 3600 + this.selectedMinute * 60;
			
			const setHour = parseInt(this.selectedHour);
			const setMinute = parseInt(this.selectedMinute);
			const isPM = parseInt(this.isPM)

			// if (isPM === 1) timeInSeconds += 12 * 3600;

			const isTimer = parseInt(this.isTimer);

			let setPeriodType = parseInt(this.periodType)

			let todoTime;
			if (isTimer == 1) {
				todoTime = dayjs(this.selectedDate)
					.hour(isPM === 1 && setHour !== 12 ? setHour + 12 : setHour)
					.minute(setMinute)
					.second(0)
					.millisecond(0);
			} else {
				todoTime = dayjs().second(0).millisecond(0);
				setPeriodType = this.$root.PERIOD_TYPES.once;
			}

			// console.log(todoTime)

			this.$root.updateTimerById(this.id, {
				taskTitle: this.taskTitle,
				setTodoTime: todoTime,
				isTimer: isTimer === 1,
				periodType: setPeriodType
			});

			// Save the updated timerDataArray to localStorage
			localStorage.setItem('TimerDataArrayStorage', JSON.stringify(this.$root.timerDataArray));

			this.closeModal();
		},
		deleteClick() {
			if (confirm("您確定要刪除事項?")) {
				this.$emit('delete-task', this.editTaskData.id);
				// this.$root.deleteTimerById(this.editTaskData.id);
				// localStorage.setItem('TimerDataArrayStorage', JSON.stringify(this.$root.timerDataArray));
				this.closeModal();
			}
		}
	}
};
</script>
<style>
.modal-body h5, p{
	user-select: none;
}
</style>