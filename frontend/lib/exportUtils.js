// CSV Export utilities

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data, headers) {
    if (!data || data.length === 0) return '';

    // Use provided headers or extract from first object
    const csvHeaders = headers || Object.keys(data[0]);

    // Create header row
    const headerRow = csvHeaders.join(',');

    // Create data rows
    const dataRows = data.map(item => {
        return csvHeaders.map(header => {
            let value = item[header];

            // Handle undefined/null
            if (value === undefined || value === null) value = '';

            // Convert to string and escape quotes
            value = String(value).replace(/"/g, '""');

            // Wrap in quotes if contains comma, newline, or quote
            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                value = `"${value}"`;
            }

            return value;
        }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent, filename) {
    // Add BOM  for proper Excel UTF-8 support
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
}

/**
 * Export meetings to CSV
 */
export function exportMeetingsCSV(meetings) {
    const headers = [
        'Date',
        'Distributor',
        'Type',
        'Person/Village',
        'Category/Topic',
        'Contact',
        'Attendees',
        'Business Potential',
        'Location',
        'Notes'
    ];

    const data = meetings.map(m => ({
        'Date': new Date(m.created_at).toLocaleDateString('en-IN'),
        'Distributor': m.user_name || '',
        'Type': m.meeting_type === 'one-on-one' ? 'One-on-One' : 'Group',
        'Person/Village': m.meeting_type === 'one-on-one' ? m.person_name : m.village_name,
        'Category/Topic': m.meeting_type === 'one-on-one' ? m.category : m.meeting_topic,
        'Contact': m.contact_number || '',
        'Attendees': m.attendee_count || '-',
        'Business Potential': m.business_potential ? `₹${m.business_potential}` : '-',
        'Location': m.location_address || '',
        'Notes': m.notes || ''
    }));

    const csv = convertToCSV(data, headers);
    const filename = `meetings_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
}

/**
 * Export sales to CSV
 */
export function exportSalesCSV(sales) {
    const headers = [
        'Date',
        'Distributor',
        'Customer',
        'Product SKU',
        'Pack Size',
        'Quantity',
        'Amount',
        'Sale Type',
        'Mode',
        'Repeat Order',
        'Location'
    ];

    const data = sales.map(s => ({
        'Date': new Date(s.created_at).toLocaleDateString('en-IN'),
        'Distributor': s.user_name || '',
        'Customer': s.customer_name,
        'Product SKU': s.product_sku,
        'Pack Size': s.pack_size || '',
        'Quantity': s.quantity,
        'Amount': s.amount,
        'Sale Type': s.sale_type,
        'Mode': s.mode || '',
        'Repeat Order': s.is_repeat_order ? 'Yes' : 'No',
        'Location': s.location_address || ''
    }));

    const csv = convertToCSV(data, headers);
    const filename = `sales_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
}

/**
 * Export samples to CSV
 */
export function exportSamplesCSV(samples) {
    const headers = [
        'Date',
        'Distributor',
        'Recipient',
        'Quantity',
        'Purpose',
        'State',
        'Location'
    ];

    const data = samples.map(s => ({
        'Date': new Date(s.created_at).toLocaleDateString('en-IN'),
        'Distributor': s.user_name || '',
        'Recipient': s.recipient_name,
        'Quantity': s.quantity,
        'Purpose': s.purpose || '',
        'State': s.state || '',
        'Location': s.location_address || ''
    }));

    const csv = convertToCSV(data, headers);
    const filename = `samples_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
}

/**
 * Export users to CSV
 */
export function exportUsersCSV(users) {
    const headers = [
        'Name',
        'Email',
        'Phone',
        'State',
        'District',
        'Role',
        'Registered On'
    ];

    const data = users.map(u => ({
        'Name': u.name,
        'Email': u.email,
        'Phone': u.phone || '',
        'State': u.state || '',
        'District': u.district || '',
        'Role': u.role,
        'Registered On': new Date(u.created_at).toLocaleDateString('en-IN')
    }));

    const csv = convertToCSV(data, headers);
    const filename = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
}
