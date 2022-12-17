import React from 'react';
import Layout from '../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'

function Setup() {

    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Setup</h1>
                </div>

                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                    <InertiaLink href="/roles" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                    Roles
                    </InertiaLink>
                    <InertiaLink href="/users" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                    Users
                    </InertiaLink>

                    
                    </div>
                    <div className="p-6 bg-white border-b border-gray-200">
                    <InertiaLink href="/suites" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                     Suites
                    </InertiaLink>
                    <InertiaLink href="/properties" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                    Properties
                    </InertiaLink>
                    <InertiaLink href="/leasing-status" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                    Leasing Status
                    </InertiaLink>
                    <InertiaLink href="/showing-status" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                    Showing Status
                    </InertiaLink>
                     <InertiaLink href="/document-types" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                    Document Types
                    </InertiaLink>
                     <InertiaLink href="/tenant-uses" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                    Tenant Uses
                    </InertiaLink> 
                    <InertiaLink href="/tenants" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                    Tenants
                    </InertiaLink> 
                    <InertiaLink href="/realtors" className="mr-1 p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                    Realtors
                    </InertiaLink>

                    </div>
                </div>

            </Layout>
        </div>
    )
}

export default Setup
