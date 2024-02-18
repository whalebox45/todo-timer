<template>
    <div class="modal fade" id="settingModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">設定</h5>
                    <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
                </div>

                <div class="modal-body">
                    <div class="form-group container-fluid row">
                        <h5 class="col-10">重設程式</h5>
                        <button type="button" id="resetBtn" class="col-2 btn btn-danger" @click="resetTimer">重設</button>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="closeModal">關閉</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
export default {
    methods: {
        closeModal() {
            let settingModal = document.getElementById('settingModal');
            let modal = Modal.getOrCreateInstance(settingModal);
            modal.hide()
        },
        resetTimer() {
            const isDelete = confirm("確定要重設本程式？")
            if (isDelete) {
                // Clean up timerDataArray, remove localStorage
                this.$root.timerDataArray.splice(0);
                localStorage.removeItem('TimerDataArrayStorage');

                location.reload();
            }

        }
    }
}
</script>