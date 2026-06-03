import React from 'react'



export default function TravelCreate () {   
    return (
        <div>
            <h2>Add Travel Request</h2>
            <form>
                <div>
                    <label htmlFor="destination">Destination:</label>
                    <input type="text" id="destination" name="destination" />
                </div>
                <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <input type="date" id="startDate" name="startDate" />
                </div>
                <div>
                    <label htmlFor="endDate">End Date:</label>
                    <input type="date" id="endDate" name="endDate" />
                </div>
                <button type="submit">Submit Request</button>
            </form>
        </div>
    )
}