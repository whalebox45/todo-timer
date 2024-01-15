<template>
	<div class="modal fade TestModal" id="testModal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Modal Title</h5>
					<button type="button" class="btn-close" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>Modal Body</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Modal } from 'bootstrap';
export default {
	props: [],
	methods: {
		closeModal() {
			let testModal = document.getElementById('testModal');
			let modal = Modal.getOrCreateInstance(testModal);
			modal.hide()
		}
	}
};
</script>