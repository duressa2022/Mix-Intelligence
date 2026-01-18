import { query } from '@/lib/db';

export type Channel = 'SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH';

export interface AlertTrigger {
    type: 'EARLY_WARNING' | 'EXTREME_HEAT' | 'CROP_FAILURE_RISK' | 'WATER_SHORTAGE';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    region_id: string;
    message: string;
}

export class AlertingSystem {
    /**
     * Checks for alert conditions and dispatches notifications
     */
    static async checkAndDispatch(regionId: string) {
        // Fetch latest metrics
        const metrics = await query(
            `SELECT di.spi_3month, p.drought_probability_percentage, p.predicted_severity
             FROM drought_indices di
             JOIN predictions p ON di.region_id = p.region_id
             WHERE di.region_id = $1
             ORDER BY di.timestamp DESC, p.forecast_date DESC LIMIT 1`,
            [regionId]
        );

        if (metrics.length === 0) return;

        const { spi_3month, drought_probability_percentage, predicted_severity } = metrics[0] as any;

        // Logic for triggering alerts
        if (spi_3month < -2.0 || (predicted_severity === 'Extreme' && drought_probability_percentage > 80)) {
            await this.dispatchAlert({
                type: 'WATER_SHORTAGE',
                severity: 'CRITICAL',
                region_id: regionId,
                message: 'Critical water shortage predicted. Strategic reserves must be activated immediately.'
            });
        } else if (spi_3month < -1.5 || predicted_severity === 'Severe') {
            await this.dispatchAlert({
                type: 'CROP_FAILURE_RISK',
                severity: 'HIGH',
                region_id: regionId,
                message: 'High risk of crop failure detected. Farmers should switch to drought-resistant crops.'
            });
        }
    }

    private static async dispatchAlert(alert: AlertTrigger) {
        console.log(`[ALERT DISPATCH] ${alert.severity} ${alert.type} for Region ${alert.region_id}: ${alert.message}`);

        // 1. Record in Database
        await query(
            `INSERT INTO alerts (region_id, alert_type, severity_level, title, message, is_active, triggered_at)
             VALUES ($1, $2, $3, $4, $5, true, NOW())`,
            [alert.region_id, alert.type, alert.severity, alert.type.replace(/_/g, ' '), alert.message]
        );

        // 2. Identify Subscribers (Fictional logic)
        // const subscribers = await query('SELECT * FROM alert_subscriptions WHERE region_id = $1 AND is_enabled = true', [alert.region_id]);

        // 3. Multi-channel send simulation
        // In real production, we would use Twilio for SMS, SendGrid for Email, Pusher for Push.
        this.simulateMultiChannelSend(alert);
    }

    private static simulateMultiChannelSend(alert: AlertTrigger) {
        const channels: Channel[] = ['SMS', 'EMAIL', 'WHATSAPP'];
        channels.forEach(ch => {
            console.log(`[${ch}] Sending to authorized recipients in region ${alert.region_id}...`);
        });
    }
}
